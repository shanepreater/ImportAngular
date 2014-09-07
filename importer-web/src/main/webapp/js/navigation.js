(function() {
	var app = angular.module("navigation", []);
	
	//Define the controller construction function so it's not got a huge nesting headache.
	var navLinksController = ['$location', '$http', '$log', '$scope',function($location, $http, $log, $scope){
		var scopedThis = this;
		$scope.navLinks = [];
		
		$log.debug("Loading the nav links from the other page.");
		$http.get("api/navLinks")
			.success(function(data){
				$log.info("Received ("+data.length+") nav links: " + data);
				$scope.navLinks = data;
				
				var current = $location.path();
				$log.info("Checking for redirect on '" + current + "' to get the correct base path")
				if(!current) {
					$location.path($scope.navLinks[0].pageName).replace();
				}
		});
		
		this.setActivePage = function(activePage) {
			$location.path(activePage);
			$location.search({});
		}
		
		this.isActivePage = function(pageName) {
			return $location.path() === "/" + pageName;
		}
	}];
	
	app.directive("navigationLinks", function() {
		return {
			restrict: "A",
			templateUrl: "fragments/navLinks.frag.html",
			controllerAs: "controller",
			controller: navLinksController
		};
	});
})();