'use strict';

app.controller('SignupCtrl', function($scope, colleges, UserFactory, AuthService, $state){
  $scope.colleges = colleges;

  $scope.sendSignup = function(signup){
    console.log('new user:', signup);
    UserFactory.create(signup)
    .then(function(newUser){
      var newLogin = {email: newUser.email, password: newUser.password}
      return AuthService.login(newLogin);
    })
    .then(function(){
      $state.go('home')
    });
  }
});


app.config(function($stateProvider) {
  $stateProvider.state('signup',{
    url:'/signup',
    templateUrl: '/js/signup/signup.html',
    controller: 'SignupCtrl',
    resolve: {
      colleges: function(CollegeFactory){
        return CollegeFactory.getAllColleges();
      }
    }
  });
});


app.directive('checkMatch', function(){
  return{
    require: 'ngModel',
    link: function(scope, element, attrs, controller){
      var firstMatch = document.getElementById(attrs.checkMatch);
      element.on('keyup', function(){
        // console.log('first:', firstMatch)
        // element.$setValidity('match', element.val()=== 0);
        // console.log('second:', element.val());
      });
    }
  };
});
