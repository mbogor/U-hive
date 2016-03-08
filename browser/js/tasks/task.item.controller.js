'use strict';

app.controller('TaskItem', function($scope, localStorageService, AuthService, TaskFactory){
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
