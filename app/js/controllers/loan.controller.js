angular
	.module('library.controllers')
	.controller('LoanController', LoanController);

LoanController.$inject = ['$scope', 'commonAPIService', '$window', '$rootScope'];

function LoanController($scope, commonAPIService, $window, $rootScope){
	if(!$rootScope.checkIdentified()){
		return;
	};

	$scope.tab = "loans";
	$scope.searchString = 'lector o ejemplar';
	$scope.title = "Préstamos";
	$scope.toString = "préstamo";
	$scope.fields = {
		  reader: {field: 'reader.username',title: 'LECTOR', width: 'calc((100% - 80px)*3/12)', align: 'center'},
			copy: {field: 'copy.article.title',title: 'EJEMPLAR', width: 'calc((100% - 80px)*3/12)', align: 'flex-start'},
			loanDate: {field: 'loanDate',title: 'FECHA DE PRÉSTAMO', width: 'calc((100% - 80px)*3/12)', align: 'center'},
			returnDate: {field: 'returnDate',title: 'FECHA DE DEVOLUCIÓN', width: 'calc((100% - 80px)*3/12)', align: 'center'}
	}

	$scope.url = 'loans';
	$scope.adminUrl = 'admin/loans';
	commonAPIService['getAll']($scope.url).then(function(response){
		$scope.response = response;
		if(response.status == 200){
			$scope.entityList = response.data;
			for (var i = 0; i < $scope.entityList.length; i++) {
				$scope.entityList[i].search = $scope.entityList[i].copy.article.title + ' ' + $scope.entityList[i].reader.username;
				$scope.entityList[i].loanDate = $scope.entityList[i].loanDate.split("T")[0];
				$scope.entityList[i].returnDate = $scope.entityList[i].returnDate ? $scope.entityList[i].returnDate.split("T")[0] : null;
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
		commonAPIService['getOne']('loans', entity).then(function(loan){
			commonAPIService['getAll']('readers').then(function(readersResponse){
				var readers = readersResponse.data;
				for (var i = 0; i < readers.length; i++) {
					readers[i].search = readers[i].firstName + ' ' + readers[i].lastName;
				}
				commonAPIService['getAll']('copies').then(function(copiesresponse){
					var copies = copiesresponse.data;
					for (var i = 0; i < copies.length; i++) {
						copies[i].search = copies[i].article.title;
					}
						var options = {
							"url" : $scope.adminUrl,
							"toString" : $scope.toString,
							"copies" : copies,
							"readers" : readers
						}
			$rootScope.openModal('adminLoan', 'lg', loan.data, options);
				})
			})
		})
	}

	$scope.showDetails = function(entity){
		commonAPIService['getOne']('loans', entity).then(function(loan){
			var options = {
				"url" : $scope.url,
				"toString" : $scope.toString
			}
			$rootScope.openModal('showLoan', 'lg', loan.data, options);
		})
	}

	commonAPIService['getAll']('copies').then(function(copiesresponse){
		var copies = copiesresponse.data;
		for (var i = 0; i < copies.length; i++) {
			copies[i].search = copies[i].article.title;
		}
		commonAPIService['getAll']('readers').then(function(readersresponse){
			var readers = readersresponse.data;
			for (var i = 0; i < readers.length; i++) {
				readers[i].search = readers[i].firstName + ' ' + readers[i].lastName;
			}
			$scope.add = function(){
				var options = {
					"url" : $scope.adminUrl,
					"toString" : $scope.toString,
					"copies" : copies,
					"readers": readers
				}
				$rootScope.openModal('adminLoan', 'lg', null, options);
			}
		})

	})

}
