(function(app){
	'use strict';

	app.service('dataShareService', function($window, $localStorage){

		function inIframe () {
			try {
				return window.self !== window.top;
			} catch (e) {
				return true;
			}
		}

		function makeId(prefix, len){
			prefix = prefix === undefined ? 'data-share_' : prefix;
			len = len || 28;
			var text = "";
			var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

			for( var i=0; i < len; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

			return prefix + text;
		}

		if(!$localStorage.data){
			$localStorage.data = {};
		}

		var self = {

			data: $localStorage.data,

			callbacks: {},

			on: function(action, callback) {

				if(!self.callbacks[action]) {
					self.callbacks[action] = [];
				}

				self.callbacks[action].push(callback);
			},

			trigger: function(action, data){
				if(self.callbacks.hasOwnProperty(action) && self.callbacks[action] && self.callbacks[action].length){
					angular.forEach(self.callbacks[action], function(callback){
						callback(data);
					});
				}
			},

			resetCallbacks: function(action){
				if(action){
					delete self.callbacks[action];
				}else{
					self.callbacks = {};
				}
			},

			windowListeners: {},

			getWindow: function(frame){
				var win, isInIframe = inIframe();

				if((frame === 'parent' && isInIframe) || (!frame && isInIframe)){

					win = $window.parent;

				}else if(frame === 'self'){

					win = $window;

				}else if(frame){
					var iframe = document.querySelector(frame);

					if(iframe){
						win = iframe.contentWindow || iframe;
					}
				}

				return win;
			},

			getSelector: function(frame){
				var isInIframe = inIframe();

				if(!frame && isInIframe){

					frame = 'parent';

				}

				return frame;
			},

			listen: function(callback, frame){
				frame = self.getSelector(frame);
				var win = self.getWindow(frame);

				if(win && frame && callback){
					win.addEventListener('message', callback);

					if(!self.windowListeners.hasOwnProperty(frame) || !self.windowListeners[frame]){
						self.windowListeners[frame] = [];
					}

					self.windowListeners[frame].push(callback);
				}
			},

			post: function(message, frame, origin){
				var win = self.getWindow(self.getSelector(frame));

				if(win){
					win.postMessage(message, (origin || location.origin));
				}
			},

			unListen: function(callback, frame){
				frame = self.getSelector(frame);
				var win = self.getWindow(frame);

				if(!callback && !frame){
					self.resetAllListeners();
				}else if(!callback){
					self.resetListenersBySelector(frame);
				}else if(frame && win && callback){
					self.removeListener(frame, win, callback);
				}
			},

			removeListener: function(frame, win, callback){
				var indices = [], i=0;

				for(i=0; i<self.windowListeners[frame].length; i=i+1){
					var windowListener = self.windowListeners[frame][i];

					if(callback.toString() === windowListener.toString()){
						win.removeEventListener('message', callback);
					}
				}

				i = indices.length;

				while(i--){
					self.windowListeners[frame].splice(i, 1);
				}
			},

			resetListenersBySelector: function(selector){
				angular.forEach(self.windowListeners[selector], function(windowListener){
					if(p === 'sameWindow'){
						$window.removeEventListener('message', windowListener);
					}else{
						$window.parent.removeEventListener('message', windowListener);
					}
				});
			},

			resetAllListeners: function(){
				for(var p in self.windowListeners){
					self.resetListenersBySelector(p);
				}
			},

			reset: function(){
				self.callbacks = {};
				self.resetAllListeners();
			},

			getData: function(path, frame){
				frame = self.getSelector(frame);
				var win = self.getWindow(frame);
				var obj = self.data;

				if(path && path !== ''){
					path = path.split('.');

					for(var p=0; p<path.length; p=p+1){
						obj = obj[path[p]];
					}
				}

				return obj;
			},

			postData: function(path, data, frame, postAction){
				frame = self.getSelector(frame);
				var win = self.getWindow(frame);
				var obj = self.data;

				if(path && path !== ''){
					path = path.split('.');

					for(var p=0; p<path.length; p=p+1){

						if(!obj.hasOwnProperty(path[p])){
							obj[path[p]] = {};
						}
						obj = obj[path[p]];
					}
				}

				obj = data;

				if(postAction){
					self.post(postAction, frame);
				}

				// if(triggerAction){
				// 	self.trigger(triggerAction, obj);
				// }
			}
		};

		return self;
	});
})(angular.module('dataShare', [
	'ngStorage'
]));
