app.config(function ($stateProvider) {

    $stateProvider.state('homepage', {
        url: '/myhomepage/:personId',
        templateUrl: 'js/user/privateHomePage/homepage.html',
        controller: 'homeCtrl',
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

app.controller('homeCtrl', function ($scope, theUser, avgRating, reviewsForUser, forSale) {
    $scope.user = theUser;
    $scope.avgRating = Math.round(avgRating);
    $scope.reviews = reviewsForUser;
    $scope.tasks = forSale
});