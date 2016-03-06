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
          },
          salesHistory: function(UserFactory, $stateParams) {
            return UserFactory.getSalesHistory($stateParams.personId)
          }
        }
    });

    $stateProvider.state('homepage.forsale', {
      url:'/forsale',
      templateUrl: '/js/user/privateHomePage/subviews/forsale.html'
    })

    $stateProvider.state('homepage.forsale.edit', {
      url:'/forsale/edit',
      templateUrl: '/js/user/privateHomePage/subviews/editTask.html'
    })

    $stateProvider.state('homepage.cart', {
      url:'/cart',
      templateUrl: '/js/user/privateHomePage/subviews/cart.html'
    })

    $stateProvider.state('homepage.purchasehistory', {
      url:'/purchasehistory',
      templateUrl: '/js/user/privateHomePage/subviews/purchasehistory.html'
    })

    $stateProvider.state('homepage.saleshistory', {
      url:'/saleshistory',
      templateUrl: '/js/user/privateHomePage/subviews/saleshistory.html'
    })

});

app.controller('homeCtrl', function ($scope, theUser, avgRating, reviewsForUser, forSale, getCart, purchaseHistory, salesHistory, UserFactory) {
    $scope.user = theUser;
    $scope.avgRating = Math.round(avgRating);
    $scope.reviews = reviewsForUser;
    $scope.tasks = forSale;
    $scope.cartItems = getCart.tasks;
    $scope.cartId = getCart._id
    $scope.purchaseHistory = purchaseHistory;
    $scope.salesHistory = salesHistory

    $scope.totalValue = function(order) {
      var total = order.reduce(function(accum, elem) {
            return accum + elem.price;
        }, 0)
      return total;
    }
    $scope.orderProcessDate = function(order) {
      return order.slice(0,10)
    }

    $scope.removeFromCart = function(item) {
      $scope.cartItems.splice($scope.cartItems.indexOf(item), 1)
      return UserFactory.removeItemFromCart($scope.cartId, item._id);
    }
});













