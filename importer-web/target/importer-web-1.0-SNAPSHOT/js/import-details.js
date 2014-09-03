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
		var scopedThis = this;
		
		this.toggleSort = function(fieldName) {
			var currentFieldName = scopedThis.sortField;
			if(fieldName === currentFieldName) {
				//Invert the selection.
				scopedThis.sortAscending = !scopedThis.sortAscending;
			} else {
				//set this field and mark it ascending.
				scopedThis.sortField = fieldName;
				scopedThis.sortAscending = true;
			}
		};
		
		this.getSortDescription = function(fieldName) {
			if(fieldName === scopedThis.sortField) {
				if(scopedThis.sortAscending) {
					return "(sort descending)";
				}
			}
			return "(sort ascending)";
		};
		
		this.getSortClasses = function(fieldName) {
			var classes = ["glyphicon"];
			var currentFieldName = scopedThis.sortField;
			var currentAscending = scopedThis.sortAscending;
			if(fieldName === currentFieldName) {
				if(currentAscending) {
					classes.push("glyphicon-chevron-up");
				} else {
					classes.push("glyphicon-chevron-down");
				}
			} else {
				classes.push("glyphicon-chevron-up", "text-muted");
			}
			return classes;
		}
		
		//Get the data
		$http.get("api/myImports").success(function(data) {
			importsHelper.importSummaryLoader(scopedThis)(data);
			//Set the default sort order.
			scopedThis.toggleSort("jobId");
		});
		$log.info("Loaded my import details");
	}]);
	
	//Activities controller
	var activities = angular.module("activities", []);
	
	activities.controller("ActivitiesController", ['$http', '$log', function($http, $log) {
		$http.get("api/activities").success(importsHelper.importSummaryLoader(this));
		$log.info("Loaded activity details");
	}]);
})();