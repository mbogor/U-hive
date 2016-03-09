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

  $scope.removeFromCart = function(task){
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
        })
      }
    })
    .then(function(cart){
      return CartFactory.removeFromCart(cart._id, t._id);
    })
    .then(function(){
      removeTaskFromLocal(t._id);
    });


  };

    //AW: glad you guys decided to use localStorage!!
  function addTaskToLocal(taskId){
    if(!localStorageService.get('cart')){
      localStorageService.set('cart', {tasks: [], timeCreated: Date.now()});
    }
    var existingCart = localStorageService.get('cart')
    existingCart.tasks.push(taskId);
    localStorageService.set('cart', existingCart);
  }

  function removeTaskFromLocal(taskId){
    var existingCart = localStorageService.get('cart');
    var i = existingCart.tasks.indexOf(taskId);
    existingCart.tasks.splice(i,1);
    localStorageService.set('cart', existingCart);
  }

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
