'use strict';

app.config(function($stateProvider){
  $stateProvider.state('cart', {
    url: '/cart',
    templateUrl: '/js/cart/cart.html',
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


app.controller('CartCtrl', function($scope, user, cart){
  $scope.user = user;
  $scope.cart = cart;

  $scope.totalValue = function(order) {
    var total = order.reduce(function(accum, elem) {
          return accum + elem.price;
      }, 0)
    return total;
  }
})
