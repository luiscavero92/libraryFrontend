angular
	.module('library.controllers')
	.controller('ArticleController', ArticleController);

ArticleController.$inject = ['$scope', 'commonAPIService', '$window', '$rootScope'];

function ArticleController($scope, commonAPIService, $window, $rootScope){
	if(!$rootScope.checkIdentified()){
		return;
	};

	$scope.tab = "articles";
	$scope.searchString = 'título';
	$scope.title = "Artículos";
	$scope.toString = "artículo";
	$scope.fields = {
		  refNumber: {field: 'refNumber',title: '#', width: 'calc((100% - 80px)*1/12)', align: 'center'},
			title: {field: 'title',title: 'TÍTULO', width: 'calc((100% - 80px)*3/12)', align: 'flex-start'},
			category: {field: 'category.description',title: 'CATEGORÍA', width: 'calc((100% - 80px)*2/12)', align: 'center'},
			publisher: {field: 'publisher',title: 'EDITORIAL', width: 'calc((100% - 80px)*3/12)', align: 'flex-start'},
			location: {field: 'location',title: 'LOCALIZACIÓN', width: 'calc((100% - 80px)*3/12)', align: 'flex-start'}
	}
	$scope.url = 'articles';
	$scope.adminUrl = 'admin/articles';
	commonAPIService['getAll']($scope.url).then(function(response){
		$scope.response = response;
		if(response.status == 200){
			$scope.entityList = response.data;
			for (var i = 0; i < $scope.entityList.length; i++) {
				$scope.entityList[i].search = $scope.entityList[i].title;
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
		commonAPIService['getOne']('articles', entity).then(function(article){
			commonAPIService['getAll']('categories').then(function(categories){
				commonAPIService['getAll']('cdus').then(function(cdusresponse){
					var cdus = cdusresponse.data;
					for (var i = 0; i < cdus.length; i++) {
						cdus[i].search = cdus[i].code + ' ' + cdus[i].description;
					}
						var options = {
							"url" : $scope.adminUrl,
							"toString" : $scope.toString,
							"categories" : categories.data,
							"cdus" : cdus
						}
			$rootScope.openModal('adminArticle', 'lg', article.data, options);
				})
			})
		})
	}

	$scope.showDetails = function(entity){
		commonAPIService['getOne']('articles', entity).then(function(article){
			var options = {
				"url" : $scope.url,
				"toString" : $scope.toString
			}
			$rootScope.openModal('showArticle', 'lg', article.data, options);
		})
	}

	commonAPIService['getAll']('categories').then(function(categories){
		commonAPIService['getAll']('cdus').then(function(cdusresponse){
			var cdus = cdusresponse.data;
			for (var i = 0; i < cdus.length; i++) {
				cdus[i].search = cdus[i].code + ' ' + cdus[i].description;
			}
			$scope.add = function(){
				var options = {
					"url" : $scope.adminUrl,
					"toString" : $scope.toString,
					"categories" : categories.data,
					"cdus" : cdus
				}
				$rootScope.openModal('adminArticle', 'lg', null, options);
			}
		})

	})

}
