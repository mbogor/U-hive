'use strict';

app.controller('ForSaleCtrl', function($scope, forsale, $state, TaskFactory, UserFactory){
  $scope.forsale = forsale; //this is the list of tasks from the resolve block of tasksForSale

  // $scope.categoryFilter = {
  //   food: false,
  //   tutoring: false,
  //   cleaning: false
  // }

  $scope.filters = {}

  $scope.categories = ['food', 'tutoring', 'cleaning']


  //AW: where's the error handling for these promises??

  $scope.detailTransfer = function(id){
    TaskFactory.getDetail(id)
    .then(function(task){

      $state.go('taskDetail', {id:task._id});

    })

  }

   $scope.sellerTransfer = function(id){
    // console.log("ID FROM SELLER TRANSFER", id)
    UserFactory.fetchById(id)
    .then(function(user){

      $state.go('publicProfile', {personId: user._id});

    })

  }


})

// app.filter('categoryFilter', function(category) {
//   return function(items) {
//     var filtered = [];
//     for(var i = 0; i < items.length; i++) {
//       if(item.category === category) filtered.push(item)
//     }
//     return filtered;
//   }
// })


app.controller('ItemCtrl', function($scope, task, $state, TaskFactory, AuthService, UserFactory, localStorageService, CartFactory){

  $scope.task = task;

  $scope.itemIsInCart = function(task){
    if(!localStorageService.get('cart')) return false;
    return localStorageService.get('cart').tasks.indexOf(task._id)>-1;
  }

  $scope.addToCart = function(task){
    var t = task;
    AuthService.getLoggedInUser()
    .then(function(user){
      if(user){
        var cartUser = user._id;
        return UserFactory.getCart(cartUser)
      }else{
        return UserFactory.getGuest()
        .then(function(guestUser){
          var cartGuest = guestUser._id;
          return UserFactory.getCart(cartGuest, 'guest');
        });
      }
    })
    .then(function(cart){
      return CartFactory.addToCart(cart._id, t._id);
    })
    .then(function(){
      addTaskToLocal(t._id);
    });
  };
  
  function addTaskToLocal(taskId){
    if(!localStorageService.get('cart')){
      localStorageService.set('cart', {tasks: [], timeCreated: Date.now()});
    }
    var existingCart = localStorageService.get('cart')
    existingCart.tasks.push(taskId);
    localStorageService.set('cart', existingCart);
  }
})
