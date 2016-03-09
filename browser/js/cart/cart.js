'use strict';
app.directive('removeTaskFromCart', function(){
  return{
    restrict: 'E',
    template: '<button ng-click="removeFromCart(task)" type="button" class="btn btn-danger btn-sm">Remove item</button>',
    controller: 'TaskItem'
  };
});

app.config(function($stateProvider){
  $stateProvider.state('cart', {
    url: '/cart',
    templateUrl: '/js/cart/cart.template.html',
    controller: 'CartCtrl',
     resolve: {
      loggedin: function(AuthService){
        return !!AuthService.getLoggedInUser()
      },
      user: function(AuthService, UserFactory){
        return AuthService.getLoggedInUser()
        .then(function(user){
          if(!user){
            return UserFactory.getGuest(); //psuedo, returns user
          }
          return user;
        });
      },
      cart: function(user, UserFactory, localStorageService, CartFactory){
        return UserFactory.getCart(user._id)
        .then(function(cart){
          if(!cart){
            return UserFactory.getCart(user._id,'guest')
          }
          return cart;
        });
      }
    }
  });
});


app.controller('CartCtrl', function($scope, user, cart, $location){
  $scope.user = user;
  if(cart){
    $scope.cartItems = cart.tasks;
  }else{
    $scope.cartItems = [];
  }

  $scope.totalValue = function(order) {
    var total = order.reduce(function(accum, elem) {
          return accum + elem.price;
      }, 0)
    return total;
  }

  $scope.changeState = function() {
    return $location.path('checkout')
  }

});

app.factory('CartFactory', function($http){
  return{
    addToCart: function(cartId, taskId){
      return $http.put('/api/cart/' + cartId + '/' + taskId)
      .then(function(res){
        return res.data;
      })
    },
    removeFromCart: function(cartId, taskId){
      return $http.put('/api/cart/' + cartId + '/remove/' + taskId)
      .then(function(res){
        return res.data;
      });
    }
  };
});
