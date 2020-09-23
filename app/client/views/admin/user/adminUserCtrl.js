const swal = require('sweetalert');
const flatpickr = require("flatpickr");

angular.module('reg')
  .controller('AdminUserCtrl',[
    '$scope',
    '$http',
    'user',
    'UserService',
    'settings',
    function($scope, $http, User, UserService, settings){
      $scope.selectedUser = User.data;
      $scope.hackStart = new Date(settings.data.hackStart).toLocaleDateString("en-US");
      // $scope.userBirth = new Date(Date.parse($scope.selectedUser.profile.dob));
      flatpickr("#selectedUserDob", {
        disableMobile: "true",
        defaultDate: new Date(Date.parse($scope.selectedUser.profile.dob)),
        onChange: function(selectedDates, dateStr, instance) {
          $scope.selectedUser.profile.dob = selectedDates[0].toLocaleDateString("en-US");
        }
      });

      // Populate the school dropdown
      populateSchools();

      /**
       * TODO: JANK WARNING
       */
      function populateSchools(){

        $http
          .get('/assets/schools.json')
          .then(function(res){
            var schools = res.data;
            var email = $scope.selectedUser.email.split('@')[1];

            if (schools[email]){
              $scope.selectedUser.profile.school = schools[email].school;
              $scope.autoFilledSchool = true;
            }

          });
      }


      $scope.updateProfile = function(){
        // $scope.selectedUser.profile.dob = new Date($scope.userBirth).toLocaleDateString("en-US");
        UserService
          .updateProfile($scope.selectedUser._id, $scope.selectedUser.profile)
          .then(response => {
            $selectedUser = response.data;
            swal("Updated!", "Profile updated.", "success");
          }, response => {
            swal("Oops, you forgot something.");
          });
      };
    }]);
