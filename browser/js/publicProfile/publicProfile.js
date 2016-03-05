app.config(function ($stateProvider) {

    $stateProvider.state('publicProfile', {
        url: '/user/:personId',
        templateUrl: 'js/publicProfile/user.html',
        controller: 'profileCtrl',
        resolve: {
          theUser: function(PublicProfileFactory, $stateParams) {
            return PublicProfileFactory.fetchById($stateParams.personId);
          },
          avgRating: function(PublicProfileFactory, $stateParams) {
            return PublicProfileFactory.fetchAvgRating($stateParams.personId)
          },
          reviewsForUser: function(PublicProfileFactory, $stateParams) {
            return PublicProfileFactory.getAllReviews($stateParams.personId)
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