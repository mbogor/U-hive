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

    $stateProvider.state('homepage.editPersonalInfo', {
      url:'/accountSettings',
      templateUrl: '/js/user/privateHomePage/subviews/editPersonalInfo.html'
    })


});


app.controller('homeCtrl', function ($scope, theUser, avgRating, reviewsForUser, forSale, getCart, purchaseHistory, salesHistory, UserFactory, $state) {
    $scope.user = theUser;
    $scope.avgRating = avgRating;
    $scope.reviews = reviewsForUser;
    $scope.tasks = forSale;
    $scope.cartItems = getCart.tasks;
    $scope.cartId = getCart._id
    $scope.purchaseHistory = purchaseHistory;
    $scope.salesHistory = salesHistory
    $scope.changed = false;
    $scope.currentTask = null;

    $scope.categories = ['food', 'tutoring', 'delivery', 'moving', 'cleaning', 'other']

    $scope.totalValue = function(order) {
      var total = order.reduce(function(accum, elem) {
            return accum + elem.price;
        }, 0)
      return total;
    }

    $scope.removeFromCart = function(item) {
      $scope.cartItems.splice($scope.cartItems.indexOf(item), 1)
      //AW: where's the error handling? why not remove the item from the 
      // cart once it has successfully been removed from the db?
      return UserFactory.removeItemFromCart($scope.cartId, item._id);

      /* 

      AW: better 
      return UserFactory.removeItemFromCart($scope.cartId, item._id)
      .then(function(){
        // remove from cartItems only once it has been successfully removed
        // from db 
        $scope.cartItems.splice($scope.cartItems.indexOf(item), 1)
      })
      */
    }

    $scope.deleteTaskForSale = function(task) {
      // AW: same problem here, remove from db, THEN remove from $scope.tasks
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
        $scope.tasks.splice($scope.tasks.indexOf(originalTask), 1)
        $state.go('homepage.forsale');
      })
    }

    // $scope.findBuyerOfTask = function(taskId) {
    //   return UserFactory.findBuyerOfTask(taskId)
    // }
    $scope.sendAccountUpdates = function(user, updatedUser) {
      $scope.changed = true;
      return UserFactory.updatePersonalInfo(user._id, updatedUser)
    }
});


app.controller('NewPostCtrl', function($scope, $state, TaskFactory){

  $scope.categories = [{id: 0, name:'food'}, {id:1, name:'tutoring'}, {id:2, name:'delivery'}, {id:3, name:'moving'}, {id:4, name:'cleaning'}, {id:5, name:'other'}]


  $scope.PostTask = function(task){
    return TaskFactory.newTask(task)
    .then(function(tsk){
      $state.go('success')
    })
  }

});

// 56db57bfd1515327c92a2e39
// 2016-10-19T09:01:29.409Z











