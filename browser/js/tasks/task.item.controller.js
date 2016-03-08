'use strict';

app.controller('TaskItem', function($scope, CartFactory, localStorageService, AuthService, UserFactory){
  $scope.expandTask =  true;

  $scope.toggleExpand = function(){
    $scope.expandTask=!$scope.expandTask;
  }

  $scope.addToCart = function(task){
    var t = task;
    console.log('adding to cart');

    AuthService.getLoggedInUser()
    .then(function(user){
      if(user){
        console.log('we have a user');
        // do something different
      }else{
        UserFactory.getGuest()
        .then(function(guestUser){
          var cartGuest = guestUser._id;
          return UserFactory.getGuestCart(cartGuest)
        })
        .then(function(cart){
          return CartFactory.addToGuestCart(cart._id, t._id)
        })
      }
    });

    if(!localStorageService.get('cart')){
      localStorageService.set('cart', {tasks: [], timeCreated: Date.now()});
    }

    var existingCart = localStorageService.get('cart')
    existingCart.tasks.push(task._id);
    localStorageService.set('cart', existingCart);


  };

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
