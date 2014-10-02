(function(){

	//My Imports controller
	var myImports = angular.module("myImports", []);
	
	myImports.controller("MyImportsController", ['$location', '$http', '$log', '$location', '$scope', function($location, $http, $log , $location, $scope) {
		$scope.tableHandler = new TableHandler($scope, $location, "jobId", true);
		
		//Get the data
		$http.get("api/myImports").success(importsHelper.importSummaryLoader($scope));
		
		$scope.showImport = function(jobId) {
			$location.path("import/"+jobId);
			$location.search({});
		};
	}]);
	
	//Activities controller
	var activities = angular.module("activities", []);
	
	activities.controller("ActivitiesController", ['$location', '$http', '$log', '$location', '$scope', function($location, $http, $log , $location, $scope) {
		$scope.tableHandler = new TableHandler($scope, $location, "jobId", true);
		$http.get("api/activities").success(importsHelper.importSummaryLoader($scope));
	}]);
	
	//The import details controller
	var importDetails = angular.module("importDetails", []);
	
	importDetails.controller("ImportDetailsController", ['$http', '$log', '$scope', '$routeParams', function($http, $log, $scope,$routeParams) {
		$scope.jobId = $routeParams.jobId;
	}]);

	var buildBaseIconClasses = function(importJob) {
		var baseIconClasses = ["outcome-icon"];
		if(importJob.processingStatus === 'FINISHED') {
			if(importJob.issueCount === 0) {
				baseIconClasses.push("clean");
			} else {
				baseIconClasses.push("has-issues");
			}
		} else if(importJob.processingStatus === 'FAILED') {
			baseIconClasses.push("failed");
		} else {
			baseIconClasses.push("processing");
		}
		return baseIconClasses;
	}
	
	var classIsPresent = function(alerts, alertType) {
		if(alerts.indexOf(alertType) >= 0) {
			return true;
		}
		return false;
	}
	
	function OutcomeAlert(className, description) {
		this.className = className;
		this.description = description;
	};
	
	var buildDecoratorObjects = function(importJob) {
		var decoratorObjects = [];
		if(classIsPresent(importJob.alerts, 'DEACTIVATED_THREAT')) {
			decoratorObjects.push(new OutcomeAlert('inactive-threat', 'All threats cleared. You may reprocess this import'));
		} else {
			if(classIsPresent(importJob.alerts, 'MALWARE_DECLARED') || classIsPresent(importJob.alerts, 'MALWARE_DETECTED')) {
				decoratorObjects.push(new OutcomeAlert('malware', "Import contains malware"));
			}
			if(classIsPresent(importJob.alerts, 'ACTIVE_THREAT')) {
				decoratorObjects.push(new OutcomeAlert('active-threat', "Threats have been identified with this import"));
			}
			if(classIsPresent(importJob.alerts, 'GENERAL_ISSUES')) {
				decoratorObjects.push(new OutcomeAlert("general-issues","Issues have been found with this import"));
			}
			if(classIsPresent(importJob.alerts, 'PASSWORD_REQUIRED')) {
				decoratorObjects.push(new OutcomeAlert("password-required", "Some files in the import are password protected"));
			}
		}
		return decoratorObjects;
	};
	
	var outcomeIconController = function($scope, $log) {
		var importJob = $scope.importJob;
		$scope.outcomeIconClasses = buildBaseIconClasses(importJob);
		$scope.decorators = buildDecoratorObjects(importJob);
	};
	
	
	importDetails.directive("outcome-icon", function(){
		return {
			restrict: "E",
			scope: {
				importJob : "="
			},
			templateUrl: "fragments/outcomeIcon.frag.html",
			controller: ["$scope", "$log", outcomeIconController],
			controllerAs: "criteriaBuilderCtrl"
		};
	});
	
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