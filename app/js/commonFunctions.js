angular.module('library')

  .run(function($rootScope) {
      $rootScope.getDescendantProp= function(obj, desc) {
        var arr = desc.split(".");
        while(arr.length && (obj = obj[arr.shift()]));
        return obj;
      };
  })

  .run(function($rootScope, $window, sessionsService) {
      $rootScope.logout= function() {
        $rootScope.identified = false;
        $rootScope.user = null;
        $rootScope.identified = null;
        $rootScope.login = null;
        $rootScope.password = null;
        sessionsService["clearCookieData"]();
        window.location.href = '#/login';
      };
  })

  .run(function($rootScope, $window, sessionsService) {
      $rootScope.redirectIfNotAdmin= function() {
        if($rootScope.login != 'admin'){
            window.location.href = '#/articles';
        }

      };
  })

  .run(function($rootScope, $window) {
      $rootScope.checkIdentified = function() {
        if($rootScope.identified != true){
            $window.location.href = '#/login';
            return;
        }
        return true;
      };
  })

  .run(function($rootScope, $uibModal, commonAPIService) {
    $rootScope.openModal = function(template, size, entity, options) {
      return modalInstance = $uibModal.open({
        templateUrl: '/views/'+template+'.html',
        size: size,
        controller: [ '$scope', '$uibModalInstance',
            function  ($scope, $uibModalInstance) {
                $scope.entity = entity;
                $scope.options = options;

                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.removeItem = function(entity){
                  commonAPIService["delete"](options.url, entity);
                  $uibModalInstance.dismiss('cancel');
                }

                $scope.addItem = function(entity){
                  commonAPIService["post"+entity.basename](options.url, entity);
                  $uibModalInstance.dismiss('cancel');
                }

                $scope.editItem = function(entity){
                  commonAPIService["patch"+entity.basename](options.url, entity);
                  $uibModalInstance.dismiss('cancel');
                }
            }
        ]
      });
    }
  })

  .run(['$rootScope','$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeSuccess', function() {
      $rootScope.currentUrl = $location.path();
    });
  }]);
