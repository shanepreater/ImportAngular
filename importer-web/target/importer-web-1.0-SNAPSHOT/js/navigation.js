(function() {
	var app = angular.module("navigation", []);
	
	//Define the controller construction function so it's not got a huge nesting headache.
	var navLinksController = ['$scope', '$http', '$log',function($scope, $http, $log){
		var scopedThis = this;
		this.navLinks = [];
		$log.debug("Loading the nav links from the other page.");
		$http.get("api/navLinks")
			.success(function(data){
			scopedThis.navLinks = data;
			
			$log.info("Received the nav links: " + data);
			
			//Find the active page from the link.
			var activePage = function() {
				var selected = scopedThis.navLinks.filter(function(x){
					if(x.active) {
						return true;
					}
					return false;
				});
				
				return selected[0];
			}();
			
			//Now update the page with it.
			scopedThis.setActivePage(activePage.pageName);
		}).error(function(data, status) {
			$log.error("Data is shit: " + data);
			$log.error("Status is: " + status);
		});
		
		this.setActivePage = function(activePage) {
			this.activePage = activePage;
			$log.debug("Setting active page to " + activePage);
			$scope.$broadcast("ACTIVE_PAGE", activePage);
		}
		
		this.isActivePage = function(pageName) {
			$log.debug("Checking if " + pageName + " matches " + this.activePage);
			return this.activePage === pageName;
		}
	}];
	
	app.directive("navigationLinks", function() {
		return {
			restrict: "E",
			templateUrl: "fragments/navLinks.frag.html",
			controllerAs: "controller",
			controller: navLinksController
		};
	});
})();