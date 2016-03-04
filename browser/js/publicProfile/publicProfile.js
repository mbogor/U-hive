app.config(function ($stateProvider) {

    $stateProvider.state('publicProfile', {
        url: '/user/:personId',
        templateUrl: 'js/publicProfile/user.html',
        controller: 'profileCtrl',
        resolve: {
          theUser: function(publicProfileFactory, $stateParams) {
            return publicProfileFactory.fetchById($stateParams.personId);
          }
        }
    });

});

app.controller('profileCtrl', function ($scope, theUser, $state) {

    $scope.user = theUser;

});