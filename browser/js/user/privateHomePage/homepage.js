app.config(function ($stateProvider) {

    $stateProvider.state('homepage', {
        url: '/myhomepage',
        templateUrl: '/js/user/privateHomePage/homepage.html',
        controller: 'homeCtrl',
        resolve: {
          theUser: function(UserFactory, AuthService) {
            return AuthService.getLoggedInUser();
          },
          avgRating: function(UserFactory, theUser) {
            return UserFactory.fetchAvgRating(theUser._id);
          },
          reviewsForUser: function(UserFactory, theUser) {
            return UserFactory.getAllReviews(theUser._id);
          },
          forSale: function(TaskFactory, theUser) {
            return TaskFactory.getForSaleByUser(theUser._id);
          },
          getCart: function(UserFactory, theUser) {
            return UserFactory.getCart(theUser._id);
          },
          purchaseHistory: function(UserFactory, theUser) {
            return UserFactory.getPurchaseHistory(theUser._id);
          },
          salesHistory: function(UserFactory, theUser) {
            return UserFactory.getSalesHistory(theUser._id);
          }
        },
        data: {
          authenticate: true
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
    console.log('homeCtrl', theUser)
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













