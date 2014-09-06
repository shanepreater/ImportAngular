(function(){
	var app = angular.module("importer", ["ngRoute", "navigation", "myImports", "activities", "footer"]);
	
	app.config(['$routeProvider', function($routeProvider) {
	    $routeProvider.
	      when('/myImports', {
	        templateUrl: 'views/myImports.html',
	        controller: 'MyImportsController'
	      }).
	      when('/activities', {
	        templateUrl: 'views/activities.html',
	        controller: 'ActivitiesController'
	      }).
	      when('/search', {
		        templateUrl: 'views/search.html',
		        controller: 'SearchController'
		      }).
	      when('/rules', {
		        templateUrl: 'views/rules.html',
		        controller: 'RulesController'
		      }).
	      otherwise({
	        redirectTo: '/myImports'
	      });
	  }   
	]);
})();