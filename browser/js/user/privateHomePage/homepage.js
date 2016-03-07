app.config(function ($stateProvider) {

    $stateProvider.state('homepage', {
        url: '/myhomepage/:personId',
        templateUrl: '/js/user/privateHomePage/homepage.html',
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
      url:'/edit',
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

app.controller('homeCtrl', function ($scope, theUser, avgRating, reviewsForUser, forSale, getCart, purchaseHistory, salesHistory, UserFactory, $state) {
    $scope.user = theUser;
    $scope.avgRating = Math.round(avgRating);
    $scope.reviews = reviewsForUser;
    $scope.tasks = forSale;
    $scope.cartItems = getCart.tasks;
    $scope.cartId = getCart._id
    $scope.purchaseHistory = purchaseHistory;
    $scope.salesHistory = salesHistory

    $scope.currentTask = null;

    $scope.categories = ['food', 'tutoring', 'delivery', 'moving', 'cleaning', 'other']

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

    $scope.deleteTaskForSale = function(task) {
      $scope.tasks.splice($scope.tasks.indexOf(task), 1)
      return UserFactory.deleteTaskForSale(task._id);
    }

    $scope.goToEditTask = function(task) {
      $scope.currentTask = task._id
      return $state.go('homepage.forsale.edit'); 
    }

    $scope.sendTaskUpdates = function(originalTask, updatedTask) {

      return UserFactory.updateTaskForSale(originalTask._id, updatedTask)
      .then(function(task){
        $state.go('homepage.forsale', $scope.user._id)
      })
    }
});

// 56db57bfd1515327c92a2e39
// 2016-10-19T09:01:29.409Z











