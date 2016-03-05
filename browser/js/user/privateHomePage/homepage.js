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
          },
          getCart: function(UserFactory, $stateParams) {
            return UserFactory.getCart($stateParams.personId)
          },
          purchaseHistory: function(UserFactory, $stateParams) {
            return UserFactory.getPurchaseHistory($stateParams.personId)
          }
        }
    });

    $stateProvider.state('homepage.forsale', {
      url:'/forsale',
      templateUrl: '/js/user/privateHomePage/subviews/forsale.html'
    })

    $stateProvider.state('homepage.cart', {
      url:'/cart',
      templateUrl: '/js/user/privateHomePage/subviews/cart.html'
    })

    $stateProvider.state('homepage.purchasehistory', {
      url:'/purchasehistory',
      templateUrl: '/js/user/privateHomePage/subviews/purchasehistory.html'
    })

});

app.controller('homeCtrl', function ($scope, theUser, avgRating, reviewsForUser, forSale, getCart, purchaseHistory) {
    $scope.user = theUser;
    $scope.avgRating = Math.round(avgRating);
    $scope.reviews = reviewsForUser;
    $scope.tasks = forSale;
    $scope.cartItems = getCart;
    $scope.purchaseHistory = purchaseHistory;


});













