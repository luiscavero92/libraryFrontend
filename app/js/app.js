angular
	.module('library', [
		'library.controllers',
		'library.directives',
		'library.services',
		'ngResource',
		'ngRoute',
		'lr.upload',
		'ui.bootstrap',
		'angularUtils.directives.dirPagination',
		'ngCookies',
		'ngSanitize'
	]);

angular
		.module('library.controllers', []);

angular
		.module('library.directives', []);

angular
		.module('library.services', []);

angular.module('library')
		.run(function(sessionsService, $rootScope) {
				var user = sessionsService['getUserData']();
				if(user != null){
					$rootScope.identified = true;
					$rootScope.login = user.username;
					$rootScope.password = user.password;
					$rootScope.user = user;
				}
		})
