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
  console.log('CartCtrl', user, cart);
  // $scope.cart = cart;
  // UserFactory.get
  $scope.user = user;
  $scope.cart = cart;
})
