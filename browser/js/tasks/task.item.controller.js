'use strict';

app.controller('TaskItem', function($scope, localStorageService, AuthService){
  $scope.expandTask =  true;

  $scope.toggleExpand = function(){
    $scope.expandTask=!$scope.expandTask;
  }

  $scope.addToCart = function(task){
    if(AuthService.getLoggedInUser()) {
      console.log('we have a user');
      // do something different
    }
    if(!localStorageService.get('cart')){
      localStorageService.set('cart', {tasks: [], timeCreated: Date.now()});
    }

    var existingCart = localStorageService.get('cart')
    console.log('item is in cart', localStorageService.get('cart').tasks.indexOf(task._id)>-1);
    existingCart.tasks.push(task._id);
    localStorageService.set('cart', existingCart);

  };

  $scope.itemIsInCart = function(task){
    // console.log('item is in cart:', localStorageService.get('cart').tasks.indexOf(task._id)>-1)
    return localStorageService.get('cart').tasks.indexOf(task._id)>-1;
  }
})
.filter("trim", function(){
  return function(description, bool){
    if(bool)return description.split(/\s/).slice(0, 10).join(' ');
    return description;
  }
})
