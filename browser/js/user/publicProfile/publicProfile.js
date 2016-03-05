app.config(function ($stateProvider) {

    $stateProvider.state('publicProfile', {
        url: '/user/:personId',
        templateUrl: 'js/user/publicProfile/user.html',
        controller: 'profileCtrl',
        resolve: {
          theUser: function(UserFactory, $stateParams) {
            return UserFactory.fetchById($stateParams.personId);
          },
          avgRating: function(UserFactory, $stateParams) {
            return UserFactory.fetchAvgRating($stateParams.personId)
          },
          reviewsForUser: function(UserFactory, $stateParams) {
            return UserFactory.getAllReviews($stateParams.personId)
          },
          forSale: function(TaskFactory, $stateParams) {
            return TaskFactory.getForSaleByUser($stateParams.personId)
          }
        }
    });

});

app.controller('profileCtrl', function ($scope, theUser, avgRating, reviewsForUser, forSale) {

    $scope.user = theUser;
    $scope.avgRating = Math.round(avgRating);
    $scope.reviews = reviewsForUser;
    $scope.tasks = forSale

});