(function(){
	var app = angular.module("importer", ["ngRoute", "navigation", "myImports", "activities", "criteria", "treeBrowser", "footer"]);
	
	app.config(['$routeProvider', function($routeProvider) {
	    $routeProvider.
	      when('/myImports', {
	        templateUrl: 'views/myImports.html',
	        controller: 'MyImportsController'
	      }).
	      when('/activities', {
	        templateUrl: 'views/activities.html',
	        controller: 'ActivitiesController',
	        controllerAs: 'activitiesCtrl'
	      }).
	      when('/search', {
		        templateUrl: 'views/search.html',
		        controller: 'SearchController'
		      }).
	      when('/rules', {
		        templateUrl: 'views/rules.html',
		        controller: 'RulesController'
		      }).
		  when('/criteriaBuilder', {
			  	templateUrl: 'views/criteriaTest.html',
			  	controller: 'CriteriaController'
		  }).
		  when('/advancedSearch', {
			  templateUrl: 'views/advancedSearch.html',
			  controller: 'AdvancedSearchController'
		  }).
		  when('/treeBrowser', {
			  templateUrl: 'views/treeBrowser.html',
			  controller: 'TreeBrowserController'
		  }).
	      otherwise({
	        redirectTo: '/myImports'
	      });
	  }   
	]);
	
	angular.module('RecursionHelper', []).factory('RecursionHelper', ['$compile', function($compile){
	    return {
	        /**
	         * Manually compiles the element, fixing the recursion loop.
	         * @param element
	         * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
	         * @returns An object containing the linking functions.
	         */
	        compile: function(element, link){
	            // Normalize the link parameter
	            if(angular.isFunction(link)){
	                link = { post: link };
	            }

	            // Break the recursion loop by removing the contents
	            var contents = element.contents().remove();
	            var compiledContents;
	            return {
	                pre: (link && link.pre) ? link.pre : null,
	                /**
	                 * Compiles and re-adds the contents
	                 */
	                post: function(scope, element){
	                    // Compile the contents
	                    if(!compiledContents){
	                        compiledContents = $compile(contents);
	                    }
	                    // Re-add the compiled contents to the element
	                    compiledContents(scope, function(clone){
	                        element.append(clone);
	                    });

	                    // Call the post-linking function, if any
	                    if(link && link.post){
	                        link.post.apply(null, arguments);
	                    }
	                }
	            };
	        }
	    };
	}]);
})();