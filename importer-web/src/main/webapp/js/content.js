(function() {
	var app = angular.module("content", ["myImports", "activities"]);
	
	var pageController = ['$location', '$scope', '$log', function($location, $scope, $log){
		var scopedThis = this;
		var eventHandle = $scope.$on("$locationChangeStart", function(event, next, current){
				scopedThis.setPageName($location.hash());
		});
		$scope.$on("$destroy", eventHandle);
		
		this.setPageName = function(pageName) {
			this.url = "fragments/" + pageName + ".frag.html";
		};
	}];
	
	app.controller("PageController", pageController);
})();