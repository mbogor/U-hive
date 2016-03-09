'use strict';


app.controller('TaskItem', function($scope, CartFactory, localStorageService, AuthService, UserFactory, TaskFactory){
  $scope.expandTask =  true;

  $scope.toggleExpand = function(){
    $scope.expandTask=!$scope.expandTask;
  }

  $scope.addToCart = function(task){
    var t = task;
    AuthService.getLoggedInUser()
    .then(function(user){
      if(user){
          var cartUser = user._id;

        UserFactory.getCart(cartUser)
        .then(function(cart){
          // AW: shouldn't this all add to the localSTorage cart?
          // I assume you want your localstorage cart to be in sync with 
          // the cart document in your db 
          return CartFactory.addToCart(cart._id, t._id);
        })
      }else{
        UserFactory.getGuest()
        .then(function(guestUser){
          var cartGuest = guestUser._id;
          return UserFactory.getGuestCart(cartGuest)
        })
        .then(function(cart){
          return CartFactory.addToCart(cart._id, t._id)
        })
      }
    });

    //AW: glad you guys decided to use localStorage!!

    if(!localStorageService.get('cart')){
      localStorageService.set('cart', {tasks: [], timeCreated: Date.now()});
    }

    var existingCart = localStorageService.get('cart')
    existingCart.tasks.push(task._id);
    localStorageService.set('cart', existingCart);


  };


  $scope.deleteTask = function(task){
    TaskFactory.destroy(task)
    // .then(function () {
    //   var idx = $scope.forsale.indexOf(task);
    //   $scope.forsale.splice(idx, 1);
    // });
  }

  $scope.itemIsInCart = function(task){
    if(!localStorageService.get('cart')) return false;
    return localStorageService.get('cart').tasks.indexOf(task._id)>-1;
  }
})
.filter("trim", function(){
  return function(description, bool){
    if(bool)return description.split(/\s/).slice(0, 10).join(' ');
    return description;
  }
})
