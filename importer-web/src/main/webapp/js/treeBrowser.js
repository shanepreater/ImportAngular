(function() {
	var treeBrowserModule = angular.module("treeBrowser", []);
	
	treeBrowserModule.controller("TreeBrowserController", [ '$scope', '$log', function($scope,$log){
		$scope.toggle = function($event) {
			var ulSibling = $event.fromElement;
			$log.info("UL found is " + ulSibling);
		};
	}]);
})();