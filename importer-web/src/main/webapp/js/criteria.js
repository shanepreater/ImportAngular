(function(){
	var module = angular.module("criteria", ["RecursionHelper"]);
	
	var criteriaIndex = 0;
	
	var criteriaHelper = {
		generateNextId : function() {
			criteriaIndex++;
			return criteriaIndex;
		},
		createNewCriterion : function() {
			return {
				property : "",
				operation : "",
				value : ""
			};
		},
		createNewGroup : function() {
			return {
				type: "ALL",
				criterion: [criteriaHelper.createNewCriterion()],
				htmlId : "criteria-" + criteriaHelper.generateNextId()
			
			}
		},
		loadCriteria : function($scope, allowDefault) {
			if($scope.criteria) {
				return $scope.criteria;
			}
			if($scope.getCriteria) {
				var criteria = $scope.getCriteria();
				if(criteria && criteria.type) {
					return criteria;
				}
			}
			if(allowDefault === true) {
				return criteriaHelper.createNewGroup();
			}
			return null;
		},
		canDelete : function($scope) {
			return function(parentCriteria) {
				if(!parentCriteria) {
					return false;
				}
				
				if(!$scope.readOnly) {
					//Can't remove the last item in a group.
					return parentCriteria.criterion.length > 1;
				}
				return false;
			}
		}
	};
	
	var criteriaBuilderController = function($scope, $log) {
		
		$scope.criteria = criteriaHelper.loadCriteria($scope, true);
		if(!$scope.criteria) {
			throw "No criteria available for the criteria builder";
		}
		
		if(!$scope.onSave) {
			throw "No onSave method provided to the criteria builder";
		}
		
		if(!$scope.readOnly) {
			$scope.readOnly = false;
		}
		
		//Save the criteria and pass it out to the caller.
		this.saveCriteria = function() {
			var criteria = $scope.criteria;
			$log.info("Saving criteria: " + criteria);
			$scope.onSave(criteria);
		};
	};
	
	var criteriaGroupController = function($scope, $log) {
		$scope.criteria = criteriaHelper.loadCriteria($scope, false);
		if(!$scope.criteria || !$scope.criteria.type) {
			throw "No criteria has been provided to the criteria group";
		}
		
		if(!$scope.parent) {
			$log.info("No parent provided to the criteria group");
		} else {
			$log.info("Parent is '" + $scope.parent + "' for criteria group");
		}
		
		if(!$scope.readOnly) {
			$scope.readOnly = false;
		}
		
		$scope.addGroup = function(criteria) {
			criteria.criterion.push(criteriaHelper.createNewGroup());
		};
		
		$scope.addCriterion = function(criteria) {
			criteria.criterion.push(criteriaHelper.createNewCriterion());
		};
		
		$scope.removeCriteria = function(criteriaToRemove) {
			var criterion = $scope.criteria.criterion;
			var elementIndex = criterion.indexOf(criteriaToRemove);
			if(elementIndex >= 0) {
				$scope.criteria.criterion = criterion.splice(elementIndex, 1);
			} else {
				throw "Unable to find criteria: " + criteriaToRemove;
			}
		};
		
		$scope.canDelete = criteriaHelper.canDelete($scope);
	};
	
	var criterionController = function($http, $scope, $log) {
		var loadPropertyModel = function(data) {
			data.operationsFor = function(propertyName) {
				var operations = this[propertyName].operations;
				if(!operations) {
					throw "No operations found for " + propertyName;
				}
			};
			
			data.indexFor = function(propertyName) {
				for(var i = 0; i < this.length; i++) {
					if(this[i].id === propertyName) {
						return i;
					}
				}
				throw "No property found with name: " + propertyName;
			};
			
			data.propertyFor = function(propertyName) {
				var index = this.indexFor(propertyName);
				if(index >= 0) {
					return this[index];
				}
				throw "No property with the name '" + propertyName + "' found.";
			}
			
			$scope.$root.queryProperties = data;
			$scope.queryProperties = data;
		};
	
		if(!$scope.criteria) {
			throw "No criteria provided to the criterion controller";
		}
		
		if(!$scope.parent) {
			$log.info("No parent provided to the criterion controller");
		} else {
			$log.info("Parent is '" + $scope.parent + "' for criterion controller");
		}
		
		if(!$scope.onRemove) {
			throw "No onRemove provided to the criteria";
		}
		
		if(!$scope.idName) {
			throw "No id name provided to the criterion controller";
		}

		//Load the properties model
		if(!$scope.$root.queryProperties)
		{
			$http.get("api/queryProperties").success(loadPropertyModel);
		} else {
			$scope.queryProperties = $scope.$root.queryProperties;
		}
		
		$scope.propertyChanged = function() {
			var newProperty = $scope.criteria.property;
			var queryProperties = $scope.queryProperties;
			var chosenProperty = queryProperties.propertyFor(newProperty);
			$scope.operations = chosenProperty.operations;
			$scope.items = chosenProperty.items;
		};
		
		$scope.canDelete = criteriaHelper.canDelete($scope);
	};
	
	//Define the main Advanced search controller
	module.controller("AdvancedSearchController", ["$http", "$scope", "$log", function($http, $scope, $log) {
		$scope.saveCriteria = function(criteria) {
			$http.post("api/search", criteria).success(function(data) {
				$log.info("Data posted to server.");
			}).error(function() {
				$log.error("Error posting data to server: " + arguments[0]);
			});
		};
	}]);
	
	//Define the custom directives for the criteria
	module.directive("criteriaBuilder", function(){
		return {
			restrict: "E",
			scope: {
				readOnly : "=",
				onSave : "&",
				getCriteria : "&"
			},
			templateUrl: "fragments/criteriaBuilder.frag.html",
			controller: ["$scope", "$log", criteriaBuilderController],
			controllerAs: "criteriaBuilderCtrl"
		};
	});
	
	module.directive("criteriaGroup",[ "RecursionHelper", function(RecursionHelper){
		return {
			restrict: "AE",
			scope: {
				readOnly : "=",
				parent : "=",
				criteria : "="
				
			},
			compile: function(element) {
	            // Use the compile function from the RecursionHelper,
	            // And return the linking function(s) which it returns
	            return RecursionHelper.compile(element);
	        },
			templateUrl: "fragments/criteriaGroup.frag.html",
			controller: ["$scope", "$log", criteriaGroupController],
			controllerAs: "criteriaGroupCtrl"
		};
	}]);
	
	module.directive("criterion", function(){
		return {
			restrict: "AE",
			require: "^criteriaGroupCtrl",
			scope: {
				readOnly : "=",
				criteria : "=",
				parent : "=",
				onRemove : "&", 
				idName : "@"
				
			},
			templateUrl: "fragments/criterion.frag.html",
			controller: ["$http", "$scope", "$log", criterionController],
			controllerAs: "criterionCtrl"
		};
	});
})();