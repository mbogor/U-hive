'use strict';

app.config(function($stateProvider){
  $stateProvider.state('cart', {
    url: '/cart',
    templateUrl: '/js/cart/cart.template.html',
    controller: 'CartCtrl',
     resolve: {
      user: function(AuthService){
        return AuthService.getLoggedInUser();
      },
      cart: function(user, UserFactory){
        return UserFactory.getCart(user._id);
      }

    },
    data: {
      authenticate: true
    }
  });
});


app.controller('CartCtrl', function($scope, user, cart, $location){
  $scope.user = user;
  $scope.cartItems = cart.tasks;

  $scope.totalValue = function(order) {
    var total = order.reduce(function(accum, elem) {
          return accum + elem.price;
      }, 0)
    return total;
  }

  $scope.changeState = function() {
    return $location.path('checkout')
  }

})
