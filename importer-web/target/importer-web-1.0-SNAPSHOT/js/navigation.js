(function() {
	var app = angular.module("navigation", []);
	
	//Define the controller construction function so it's not got a huge nesting headache.
	var navLinksController = ['$location', '$http', '$log',function($location, $http, $log){
		var scopedThis = this;
		this.navLinks = [];
		
		$log.debug("Loading the nav links from the other page.");
		$http.get("api/navLinks")
			.success(function(data){
				$log.info("Received the nav links: " + data);
				scopedThis.navLinks = data;
				
				var currentHash = $location.hash();
				$log.info("Checking for redirect on '" + currentHash + "' to get the correct base path")
				if(!currentHash) {
					$location.hash(scopedThis.navLinks[0].pageName).replace();
				}
		});
		
		this.setActivePage = function(activePage) {
			$location.hash(activePage);
		}
		
		this.isActivePage = function(pageName) {
			return $location.hash() === pageName;
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