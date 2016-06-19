angular
	.module('library.controllers')
	.controller('CopyController', CopyController);

CopyController.$inject = ['$scope', 'commonAPIService', '$window', '$rootScope'];

function CopyController($scope, commonAPIService, $window, $rootScope){
	if(!$rootScope.checkIdentified()){
		return;
	};
	$rootScope.redirectIfNotAdmin();

	$scope.tab = "copies";
	$scope.searchString = 'artículo';
	$scope.title = "Ejemplares";
	$scope.toString = "ejemplar";
	$scope.fields = {
		  copyNumber: {field: 'copyNumber',title: '#', width: 'calc((100% - 80px)*1/12)', align: 'center'},
			article: {field: 'article.title',title: 'ARTÍCULO', width: 'calc((100% - 80px)*9/12)', align: 'flex-start'},
			available: {field: 'available',title: 'DISPONIBLE', width: 'calc((100% - 80px)*2/12)', align: 'center'}
	}

	$scope.url = 'copies';
	$scope.adminUrl = 'admin/copies';
	commonAPIService['getAll']($scope.url).then(function(response){
		$scope.response = response;
		if(response.status == 200){
			$scope.entityList = response.data;
			for (var i = 0; i < $scope.entityList.length; i++) {
				$scope.entityList[i].search = $scope.entityList[i].article.title;
				$scope.entityList[i].available = $scope.entityList[i].available ? 'Si' : 'No';
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
		commonAPIService['getOne']('copies', entity).then(function(copy){
			commonAPIService['getAll']('articles').then(function(articlesResponse){
				var articles = articlesResponse.data;
				for (var i = 0; i < articles.length; i++) {
					articles[i].search = articles[i].title;
				}
						var options = {
							"url" : $scope.adminUrl,
							"toString" : $scope.toString,
							"articles" : articles
						}

			$rootScope.openModal('adminCopy', 'lg', copy.data, options);
			})
		})
	}

	$scope.showDetails = function(entity){
		commonAPIService['getOne']('copies', entity).then(function(copy){
			var entity = copy.data;
			entity.addedOn = entity.addedOn.split("T")[0];
			var options = {
				"url" : $scope.url,
				"toString" : $scope.toString
			}
			$rootScope.openModal('showCopy', 'lg', entity, options);
		})
	}

	commonAPIService['getAll']('categories').then(function(categories){
		commonAPIService['getAll']('articles').then(function(articlesResponse){
			$scope.add = function(){
				var articles = articlesResponse.data;
				for (var i = 0; i < articles.length; i++) {
					articles[i].search = articles[i].title;
				}
				var options = {
					"url" : $scope.adminUrl,
					"toString" : $scope.toString,
				  "articles" : articles
				}
				$rootScope.openModal('adminCopy', 'lg', null, options);
			}
		})

	})

}
