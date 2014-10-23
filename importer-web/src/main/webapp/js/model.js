// Define the model objects for the import application.
if(typeof idms === 'undefined') {
	var idms = {};
}

idms.model = {};
(function(){
	var loadFromJson = function(jsContainerObject, jsonObject) {
		var jsObject = $.extend(true, jsContainerObject, jsonObject);
		return jsObject;
	};	
	var loadFromJsonString = function(jsContainerObject, jsonString) {
		var jsonObject = $.parseJSON(jsonString);
		return loadFromJson(jsContainerObject, jsonObject);
	};
	
	/**
	 * Define the User class to hold a users sid and roles.
	 */
	(function(){
		idms.model.User = function() {
			this.userSid = "";
			this.roles = [];
		};
		
		idms.model.User.prototype.hasRole = new function(role) {
			return $.inArray(role, this.roles);
		};
		
		idms.model.User.loadFromJson = function(jsonObject) {
			return loadFromJson(new idms.model.User(), jsonObject);
		}
		
		idms.model.User.loadFromJsonString = function(jsonString) {
			return loadFromJsonString(new idms.model.User(), jsonString);
		}
	})();
	
	/**
	 * Define the main Import class to hold the details of an import.
	 */
	(function(){
		idms.model.Import = function() {
			this.id = 0;
			this.jobId = "";
			this.description = "";
			this.date = new Date();
			this.status = "WAITING_FOR_PAYLOAD";
			this.usedPublishers = [];
			this.importer = null;
		};
		
		idms.model.Import.prototype.isComplete = new function() {
			return this.status == "FINISHED" || this.status == "ERRORED";
		};
		
		idms.model.Import.loadFromJsonString = function(jsonString) {
			return loadFromJsonString(new idms.model.Import(), jsonString);
		};
		
		idms.model.Import.loadFromJson = function(jsonObject) {
			return loadFromJson(new idms.model.Import(), jsonObject);
		};
		
		idms.model.Import.prototype.canUserAccess = new function(user) {
			if(typeof user !== 'User') {
				throw new Error("user must be of type idms.model.User");
			}
			
			if(this.importer === user.userSid) {
				return true;
			} 
			
			if(user.hasRole("SUPPORT") || user.hasRole("INFO_SEC")) {
				return true;
			}
			return false;
		};
	})();
	
	/**
	 * Define the InformationRequest class to hold the information request details.
	 */
	(function(){
		
		var Status = {
	        SUBMITTED : "SUBMITTED",
			COMPLETED : "COMPLETED",
			ERROR : "ERROR"
		};
		
		var RequestType = {
			FC : "FC",
			MK : "MK"
		};
		
		idms.model.InformationRequest = function() {
			this.id = 0;
			this.status = Status.COMPLETED;
			this.requestSubmitted = new Date();
			this.responseReceived = new Date();
			this.requestType = RequestType.FC;
		}
		
		idms.model.InformationRequest.loadFromJsonString = function(jsonString) {
			return loadFromJsonString(new idms.model.InformationRequest(), jsonString);
		};
		
		idms.model.InformationRequest.loadFromJson = function(jsonObject) {
			return loadFromJson(new idms.model.InformationRequest(), jsonObject);
		};
		
		idms.model.InformationRequest.Status = Status;
		
		idms.model.InformationRequest.RequestType = RequestType;
		
	})();
	
	/**
	 * Define the imported file 
	 */
	(function(){
		var AntiVirusStatus = {
			CLEAN : "CLEAN",
			MALWARE : "MALWARE",
			ERROR : "ERROR"
		};
		
		var AntiVirusResult = function(engineName, result) {
			this.engineName = engineName;
			this.result = result;
			this.engineVersion = "";
			this.dbVersion = "";
		};
		
		var HashDetails = function() {
			this.md5 = "";
			this.sha1 = "";
			this.sha256 = "";
		};
		
		var FileType = function() {
			this.score = 0.0;
			this.type = "";
		}
		
		idms.model.ImportedFile = function() {
			this.id = 0;
			this.path = "";
			this.parentCount = 0;
			this.hash = new HashDetails();
			this.antiVirusResults = [
			     new AntiVirusResult("AV1", AntiVirusStatus.CLEAN), 
			     new AntiVirusResult("AV2", AntiVirusStatus.CLEAN)];
			this.fileType = new FileType();
		}
		
		idms.model.ImportedFile.loadFromJsonString = function(jsonString) {
			return loadFromJsonString(new idms.model.ImportedFile(), jsonString);
		};
		
		idms.model.ImportedFile.loadFromJson = function(jsonObject) {
			return loadFromJson(new idms.model.ImportedFile(), jsonObject);
		};
		
		idms.model.ImportedFile.AntiVirusStatus = AntiVirusStatus;
	})();
	
	(function(){
		idms.model.Issue = function() {
			this.id = 0;
			this.ruleId = 0;
			this.description = "";
			this.importedFile = 0;
		};
	})();
})();
	 