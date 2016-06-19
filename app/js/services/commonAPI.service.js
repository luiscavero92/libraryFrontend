angular
	.module('library.services')
	.service('commonAPIService', commonAPIService);

  commonAPIService.$inject = ['$resource', '$http', '$rootScope', '$route'];

  function commonAPIService($resource, $http, $rootScope, $route){
  	this.server = 'http://127.0.0.1:9000/';

		this.getAll = function(url){

			var credentials = btoa($rootScope.login + ':' + $rootScope.password);
			return $http({
							 method: 'GET',
							 url: this.server+url,
							 headers: {
    				 		'Authorization': 'Basic '+ credentials
							}
					 }).then(function successCallback(successResponse) {
							return successResponse;
					 }, function errorCallBack(errorResponse){
							return errorResponse;
					 });
		}

		this.getOne = function(url, entity){
			var credentials = btoa($rootScope.login + ':' + $rootScope.password);
			return $http({
							 method: 'GET',
							 url: this.server+url+'/'+entity.id,
							 headers: {
    				 		'Authorization': 'Basic '+ credentials
							}
					 }).then(function successCallback(successResponse) {
							return successResponse;
					 }, function errorCallBack(errorResponse){
						 	$rootScope.openModal('errorInternal', 'sh', errorResponse);
							return errorResponse;
					 });
		}

		this.getAccess = function(user){
			var credentials = btoa(user.nick + ':' + user.password);
			var url = 'access';
			return $http({
							 method: 'GET',
							 url: this.server+url+'/'+credentials,
					 }).then(function successCallback(successResponse) {
							return successResponse;
					 }, function errorCallBack(errorResponse){
							return errorResponse;
					 });
		}

		this.delete = function(url, entity){
			var record = entity.id;
			var credentials = btoa($rootScope.login + ':' + $rootScope.password);
			return $http({
							 method: 'DELETE',
							 url: this.server+url+'/'+record,
							 headers: {
								'Authorization': 'Basic '+ credentials
							}
					 }).then(function successCallback(successResponse) {
						  $route.reload();
							return successResponse;
					 }, function errorCallBack(errorResponse){
						 	console.log(errorResponse);
							$rootScope.openModal('errorInternal', 'sh', errorResponse);
					 });
		}

		this.post = function(url, entity){
			console.log(entity);
			var credentials = btoa($rootScope.login + ':' + $rootScope.password);
			return $http({
							 method: 'POST',
							 url: this.server+url,
							 data: entity,
							 headers: {
								'Authorization': 'Basic '+ credentials
							}
					 }).then(function successCallback(successResponse) {
						  $route.reload();
							return successResponse;
					 }, function errorCallBack(errorResponse){
						 	console.log(errorResponse);
							$rootScope.openModal('errorInternal', 'sh', errorResponse.data.error_description.replace(/ERROR:/g,"<br> - ").replace(/Your formulary has the following errors:/g, "<b>Your formulary has the following errors:</b>"));
					 });
		}

		this.patch = function(url, entity, id){
			console.log(entity);
			var credentials = btoa($rootScope.login + ':' + $rootScope.password);
			return $http({
							 method: 'PATCH',
							 url: this.server+url+'/'+id,
							 data: entity,
							 headers: {
								'Authorization': 'Basic '+ credentials
							}
					 }).then(function successCallback(successResponse) {
						  $route.reload();
							return successResponse;
					 }, function errorCallBack(errorResponse){
						 	console.log(errorResponse);
							$rootScope.openModal('errorInternal', 'sh', errorResponse.data.error_description.replace(/ERROR:/g,"<br> - ").replace(/Your formulary has the following errors:/g, "<b>Your formulary has the following errors:</b>"));
					 });
		}

		this.postArticle = function(url, entity){
			var requestEntity = {
				"article" : {
					"title" : entity.title,
					"subtitle" : entity.subtitle,
					"refNumber": entity.refNumber,
					"isbn" : entity.isbn,
					"publisher" : entity.publisher,
					"legalDeposit" : entity.legalDeposit,
					"cdu" : entity.cdu.id,
					"location" : entity.location,
					"category" : entity.category.id,
					"note" : entity.note,
					"loanable" : entity.loanable,
					"authors" : entity.authors
				}
			}
			return this.post(url, requestEntity);
		}

		this.patchArticle = function(url, entity){
			var requestEntity = {
				"article" : {
					"title" : entity.title,
					"subtitle" : entity.subtitle,
					"refNumber": entity.refNumber,
					"isbn" : entity.isbn,
					"publisher" : entity.publisher,
					"legalDeposit" : entity.legalDeposit,
					"cdu" : entity.cdu.id,
					"location" : entity.location,
					"category" : entity.category.id,
					"note" : entity.note,
					"loanable" : entity.loanable,
					"authors" : entity.authors
				}
			}
			return this.patch(url, requestEntity, entity.id);
		}

		this.postCopy = function(url, entity){
			var requestEntity = {
				"copy" : {
					"copyNumber" : entity.copyNumber,
					"article" : entity.article.id,
					"damaged" : entity.damaged,
					"lost": entity.lost,
					"note" : entity.note,
					"available" : entity.available
				}
			}
			return this.post(url, requestEntity);
		}

		this.patchCopy = function(url, entity){
			var requestEntity = {
				"copy" : {
					"copyNumber" : entity.copyNumber,
					"article" : entity.article.id,
					"damaged" : entity.damaged,
					"lost": entity.lost,
					"note" : entity.note,
					"available" : entity.available
				}
			}
			return this.patch(url, requestEntity, entity.id);
		}

		this.postReader = function(url, entity){
			var requestEntity = {
				"reader" : {
					"recordNumber" : entity.recordNumber,
					"nif" : entity.nif,
					"firstName" : entity.firstName,
					"lastName" : entity.lastName,
					"email" : entity.email,
					"phone" : entity.phone,
					"username" : entity.username,
					"password" : entity.password
				}
			}
			return this.post(url, requestEntity);
		}

		this.patchReader = function(url, entity){
			var requestEntity = {
				"reader" : {
					"recordNumber" : entity.recordNumber,
					"nif" : entity.nif,
					"firstName" : entity.firstName,
					"lastName" : entity.lastName,
					"email" : entity.email,
					"phone" : entity.phone
				}
			}
			return this.patch(url, requestEntity, entity.id);
		}

		this.postLoan = function(url, entity){
			var requestEntity = {
				"loan" : {
					"copy" : entity.copy.id,
					"reader" : entity.reader.id
				}
			}
			return this.post(url, requestEntity);
		}

		this.patchLoan = function(url, entity){
			var requestEntity = {
				"loan" : {
					"copy" : entity.copy.id,
					"reader" : entity.reader.id
				}
			}
			return this.patch(url, requestEntity, entity.id);
		}
	}
