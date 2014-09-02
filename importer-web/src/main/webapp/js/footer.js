(function() {
	var app = angular.module("footer", []);
	
	var footerController = ['$http', '$log',function($http, $log) {
		var scopedThis = this;
		this.version = "loading";
		this.environment = "Unknown";
		
		$log.debug("About to load the version details");
		
		//Invoke the data load for the version info.
		$http.get('api/versionInfo').success(function(data){
			$log.debug("Version is " + data.version + " and environment is " + data.environment);
			scopedThis.version = data.version;
			scopedThis.environment = data.environment;
		});
		
		this.getVersion = function() {
			$log.debug("Getting the version");
			return this.version;
		};
	}];
	
	app.controller("FooterController", footerController);
	
	app.directive("versionFooter", function() {
		return {
			restrict: "A",
			templalteUrl: "bad/fragments/footer.frag.html",
			controllerAs: "footerCtrl",
			controller: footerController
		};
	});
})();