(function(demo){
	'use strict';
	demo.config(function ($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {
			templateUrl: "./demo/demo.html",
			controller: 'AppCtlr',
		})
		.when('/readme', {
			templateUrl: "./demo/readme.html",
			controller: 'AppCtlr',
		})
		.otherwise({ redirectTo: '/' });
		$locationProvider.html5Mode(true);
	});

	demo.controller('AppCtlr', function(){
		var self = this;

		this.demoOptions = [{
			name: 'None',
			fn: undefined
		},{
			name: 'Update model',
			fn: function(arg){
				var temp = null;
				self.documentation['item'].properties['scope']['property'].value = temp;
			}
		}];

		this.updateChange = function(dir, propName){
			if(dir.meta.properties.scope[propName].optionModel == null){
				dir.meta.properties.scope[propName].optionModel = dir.meta.properties.scope[propName].defaultOption;
			}

			var optionModel = dir.meta.properties.scope[propName].optionModel;
			dir.meta.properties.scope[propName].value = dir.meta.properties.scope[propName].options[optionModel].fn;
		};

		this.documentation = {
			title: 'Name of module',
			description: null,

			// Directive
			/*
			"directiveName": {
				description: null,
				markup: null,
				properties: {
					scope: {
						"scopeProperty": {
							type: null,
							description: null,
							options: self.demoOptions,
							value: null,
							defaultOption: "1",
							change: function(dir){ self.updateChange(dir, 'scopeProperty'); }
						},
					}
				}
			}
			*/

			// Service
			/*
			CKronos: {
				description: null,
				properties: {
					"propertyOrMethod": {
						description: null,
						arguments: {
							arg: {
								type: null,
								description: null
							}
						},
						returns: {
							type: null,
							description: null
						}
					}
				}
			}
			*/
		}
	});
})(angular.module('app', [
	'ngResource',
	'ngSanitize',
	'ngRoute'
]));
