angular
	.module('library.controllers')
	.controller('LoginController', LoginController);

LoginController.$inject = ['$scope', 'commonAPIService','$rootScope', '$window', 'sessionsService'];

function LoginController($scope, commonAPIService, $rootScope, $window, sessionsService){
	if($rootScope.identified == true){
			$window.location.href = '#/articles';
	}
	$scope.tab = "login";
	$scope.title = "Acceso";
	$scope.searchBy = 'title';

	$scope.access = function(user){

		commonAPIService['getAccess'](user).then(function(response){
			if(response.status == 200){
				$rootScope.identified = true;
				$rootScope.login = user.nick;
				$rootScope.password = user.password;
				$rootScope.user = response.data;
				sessionsService["setUserData"](user.nick, user.password);
				window.location.href = '#/articles';
			}else{
				$rootScope.openModal('loginFail', 'sh');
			}
		})


	}


}
