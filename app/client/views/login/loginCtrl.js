angular.module('reg')
  .controller('LoginCtrl', [
    '$scope',
    '$http',
    '$state',
    'settings',
    'Utils',
    'AuthService',
    function($scope, $http, $state, settings, Utils, AuthService){

      // Is registration open?
      var Settings = settings.data;
      $scope.regIsOpen = Utils.isRegOpen(Settings);

      // Start state for login
      $scope.loginState = 'login';

      $scope.registering = false;

      function onSuccess(user) {
        if (user.admin) {
          $state.go('app.admin.stats');
        } else {
          $state.go('app.dashboard');
        }
      }

      function onError(data){
        $scope.error = data.message;
      }

      function resetError(){
        $scope.error = null;
      }

      $scope.login = function(){
        resetError();
        $scope.registering = false;
        AuthService.loginWithPassword(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.register = function(){
        resetError();
        if (!$scope.registering) {
          $scope.registering = true;
        } else {
          if ($scope.password != $scope.confirmPassword) {
            swal("Oops...", "Passwords do not match.", "error");
          } else {
            AuthService.register(
              $scope.email, $scope.password, $scope.confirmPassword, onSuccess, onError);
          }
        }
      };

      $scope.setLoginState = function(state) {
        $scope.loginState = state;
      };

      $scope.sendResetEmail = function() {
        var email = $scope.email;
        AuthService.sendResetEmail(email);
        swal("Don't sweat!", "An email should be sent to you shortly.", "success");
      };

    }
  ]);
