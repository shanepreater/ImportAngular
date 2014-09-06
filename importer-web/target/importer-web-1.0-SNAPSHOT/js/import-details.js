(function(){

	//My Imports controller
	var myImports = angular.module("myImports", []);
	
	myImports.controller("MyImportsController", ['$http', '$log', '$location', '$scope', function($http, $log , $location, $scope) {
		$scope.tableHandler = new TableHandler($scope, $location, "jobId", true);
		
		//Get the data
		$http.get("api/myImports").success(importsHelper.importSummaryLoader($scope));
	}]);
	
	//Activities controller
	var activities = angular.module("activities", []);
	
	
	activities.controller("ActivitiesController", ['$http', '$log', '$location', '$scope', function($http, $log , $location, $scope) {
		$scope.tableHandler = new TableHandler($scope, $location, "jobId", true);
		$http.get("api/activities").success(importsHelper.importSummaryLoader($scope));
	}]);
	
	var importsHelper = {
		statusClassMap : {
			"DOWNLOADABLE": ["downloadable",0],
			"MALWARE": ["malware",1],
			"ERROR": ["error",2],
			"IN_PROGRESS": ["in-progress",3],
			"FAILED": ["failed",4]
		},
		importSummaryLoader : function($scope) {
			return function(data) {
				data.forEach(function(item){
					var value = importsHelper.statusClassMap[item.status];
					item.statusClass = value[0];
					item.statusOrder = value[1];
				});
			
				$scope.imports = data;
				
				var tableHandler = $scope.tableHandler;
				if(tableHandler) {
					tableHandler.updateSortDetails();
				}
			}
		}
	};
	
	function TableHandler($scope, $location, defaultSortField, defaultSortAscending) {
		var scopedThis = this;
		
		//Allow the sort fields to be acquired from the location service.
		this.updateSortDetails = function() {
			$scope.currentSort = scopedThis.getSortObject();
		};
		
		this.toggleSort = function(fieldName) {
			var currentSort = scopedThis.getSortObject();
			if(!currentSort) {
				currentSort = {};
			}
			var currentFieldName = currentSort.sortField;
			if(fieldName === currentFieldName) {
				//Invert the selection.
				currentSort.sortAscending = !currentSort.sortAscending;
			} else {
				//set this field and mark it ascending.
				currentSort.sortField = fieldName;
				currentSort.sortAscending = true;
			}
			
			$location.search(currentSort);
		};
		
		this.getSortObject = function() {
			var currentSort = $location.search();
			if(!currentSort.sortField) {
				currentSort.sortField = defaultSortField;
				currentSort.sortAscending = defaultSortAscending;
			}
			return currentSort;
		}
		
		this.getSortDescription = function(fieldName) {
			var currentSort = scopedThis.getSortObject();
			if(fieldName === currentSort.sortField) {
				if(!currentSort.sortAscending) {
					return "(sort descending)";
				}
			}
			return "(sort ascending)";
		};
		
		this.getSortClasses = function(fieldName) {
			var classes = ["glyphicon"];
			var currentSort = scopedThis.getSortObject();
			var currentFieldName = currentSort.sortField;
			var currentAscending = currentSort.sortAscending;
			if(fieldName === currentFieldName) {
				if(currentAscending) {
					classes.push("glyphicon-chevron-down");
				} else {
					classes.push("glyphicon-chevron-up");
				}
			} else {
				classes.push("glyphicon-chevron-down", "text-muted");
			}
			return classes;
		}
		
		//Add the handler to respond to changes in the location service.
		var unbindHandler = $scope.$on("$locationChangeSuccess", this.updateSortDetails);
		
		//Don't forget to let it get destroyed.
		$scope.$on("$destroy", unbindHandler);
	}
})();