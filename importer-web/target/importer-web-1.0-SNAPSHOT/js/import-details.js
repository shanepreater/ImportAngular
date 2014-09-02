(function(){
	var importsHelper = {
		statusClassMap : {
			"IN_PROGRESS": "in-progress",
			"MALWARE": "malware",
			"ERROR": "error",
			"FAILED": "failed",
			"DOWNLOADABLE": "downloadable"
		},
		importSummaryLoader : function(scopedThis) {
			return function(data) {
				data.forEach(function(item){
					item.statusClass = importsHelper.statusClassMap[item.status];
				});
			
				scopedThis.imports = data;
			}
		}
	};

	//My Imports controller
	var myImports = angular.module("myImports", []);
	
	myImports.controller("MyImportsController", ['$http', '$log', function($http, $log) {
		$http.get("api/myImports").success(importsHelper.importSummaryLoader(this));
		$log.info("Loaded my import details");
	}]);
})();