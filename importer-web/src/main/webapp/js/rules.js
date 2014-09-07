(function() {
	var rulesHelper = {
			currentId : 2,
			nextId : function() {
				this.currentId = this.currentId + 1;
				return this.currentId;
			}
	};
	
	var rulesModule = angular.module("rules", []);
	
	rulesModule.controller("RuleEditorController", ["$http", "$scope", "$timeout", "$log", function($http, $scope, $timeout, $log){
		var scopedThis = this;
		this.showDialog = function(rule, readOnly) {
			if(rule) {
				scopedThis.rule = rule;
			} else {
				scopedThis.rule = {id : "new"};
			}
			if(readOnly) {
				scopedThis.readOnly = true;
			} else {
				scopedThis.readOnly = false;
			}
			
			$("ruleEditorModal").modal();
		};
		
		this.isFieldReadOnly = function(fieldName) {
			if(scopedThis.readOnly) {
				return true;
			}
			
			if(scopedThis.rule.id !== "new") {
				if(fieldName === "name") {
					return true;
				}
			}
			
			return false;
		}
		
		this.saveRule = function() {
			//TODO: Post this to the server.
			if(scopedThis.rule.id === "new") {
				scopedThis.rule.id = rulesHelper.nextId();
			}
			
			/*
			$http.post("api/rule", scopedThis.rule).success(function(data){
				scopedThis.rule = data;
				$timeout(function(){
					$("ruleEditorModal").modal("hide");
				}, 1000);
			});*/
			
			$scope.$broadcast("ruleSaved", scopedThis.rule);
		};
	}]);
})();