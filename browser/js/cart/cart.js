'use strict';

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
            console.log('no logged-in user')
            return UserFactory.getGuest(); //psuedo, returns user
          }
          return user;
        });
      },
      cart: function(user, UserFactory, localStorageService, CartFactory){
        console.log('in cart resolve block', user);
        return UserFactory.getCart(user._id)
        .then(function(cart){
          if(!cart){
            return UserFactory.getGuestCart(user._id)
          }
          return cart;
        });
      }
    }
  });
});


app.controller('CartCtrl', function($scope, user, cart, $location){
  $scope.user = user;
  console.log('cart ctrl:', $scope.user, cart);
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
      });
    },
    removeFromCart: function(cartId, taskId){
      return $http.put('/api/cart/' + cartId + '/' + taskId)
      .then(function(res){
        return res.data;
      });
    }
  };
});
