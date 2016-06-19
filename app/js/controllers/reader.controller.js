angular
	.module('library.controllers')
	.controller('ReaderController', ReaderController);

ReaderController.$inject = ['$scope', 'commonAPIService', '$window', '$rootScope'];

function ReaderController($scope, commonAPIService, $window, $rootScope){
	if(!$rootScope.checkIdentified()){
		return;
	};

	$rootScope.redirectIfNotAdmin();
	$scope.tab = "readers";
	$scope.searchString = 'lector';
	$scope.title = "Lectores";
	$scope.toString = "lector";
	$scope.fields = {
		  recordNumber: {field: 'recordNumber',title: '#', width: 'calc((100% - 80px)*1/12)', align: 'center'},
			username: {field: 'username',title: 'USUARIO', width: 'calc((100% - 80px)*3/12)', align: 'flex-start'},
			firstName: {field: 'firstName',title: 'NOMBRE', width: 'calc((100% - 80px)*4/12)', align: 'flex-start'},
			lastName: {field: 'lastName',title: 'APELLIDOS', width: 'calc((100% - 80px)*4/12)', align: 'flex-start'}
	}

	$scope.url = 'readers';
	$scope.adminUrl = 'admin/readers';
	commonAPIService['getAll']($scope.url).then(function(response){
		$scope.response = response;
		if(response.status == 200){
			$scope.entityList = response.data;
			for (var i = 0; i < $scope.entityList.length; i++) {
				$scope.entityList[i].search = $scope.entityList[i].firstName + ' ' + $scope.entityList[i].lastName + ' ' + $scope.entityList[i].username;
			}
		}else{
			$scope.entityList = [];
		}
	})

	$scope.remove = function(entity){
		var options = {
			"url" : $scope.adminUrl,
			"toString" : $scope.toString
		}
		$rootScope.openModal('deleteItem', 'sh', entity, options);
	}

	$scope.edit = function(entity){
		console.log('entra');
		commonAPIService['getOne']('readers', entity).then(function(copy){

			var options = {
				"url" : $scope.adminUrl,
				"toString" : $scope.toString
			}
			$rootScope.openModal('adminReader', 'lg', copy.data, options);
		})
	}

	$scope.showDetails = function(entity){
		commonAPIService['getOne']('readers', entity).then(function(copy){
			var entity = copy.data;
			var options = {
				"url" : $scope.url,
				"toString" : $scope.toString
			}
			$rootScope.openModal('showReader', 'lg', entity, options);
		})
	}

	commonAPIService['getAll']('categories').then(function(categories){
		$scope.add = function(){
			var articles = articlesResponse.data;
			for (var i = 0; i < articles.length; i++) {
				articles[i].search = articles[i].title;
			}
			var options = {
				"url" : $scope.adminUrl,
				"toString" : $scope.toString
			}
			$rootScope.openModal('adminCopy', 'lg', null, options);
		}
	})

}
