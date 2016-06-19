angular.module('library')

  .config(['$resourceProvider', function($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
  }])

  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/', {
          redirectTo: '/login',
        }).
        when('/login', {
          templateUrl: '/views/login.html',
          controller: 'LoginController'
        }).
        when('/articles', {
          templateUrl: '/views/body.html',
          controller: 'ArticleController'
        }).
        when('/copies', {
          templateUrl: '/views/body.html',
          controller: 'CopyController'
        }).
        when('/readers', {
          templateUrl: '/views/body.html',
          controller: 'ReaderController'
        }).
        when('/loans', {
          templateUrl: '/views/body.html',
          controller: 'LoanController'
        }).
        when('/error', {
          templateUrl: '/views/error.html'
        }).
        otherwise({
          redirectTo: '/error'
        });
    }])

    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])

  ;
