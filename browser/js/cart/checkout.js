app.config(function ($stateProvider) {

  $stateProvider.state('checkout', {
      url: '/checkout',
      templateUrl: '/js/cart/checkout.template.html',
      controller: 'CheckoutCtrl',
      resolve: {
        user: function(AuthService){
          return AuthService.getLoggedInUser();
      },
        cart: function(user, UserFactory){
          return UserFactory.getCart(user._id);
      }
      }
  });
}); 

app.controller('CheckoutCtrl', function($scope, user, cart){
  $scope.user = user;
  $scope.creditCards = ['Visa', 'Mastercard', 'American Express', 'Discover']

  $scope.cartItems = cart.tasks;

  $scope.totalValue = function(order) {
    var total = order.reduce(function(accum, elem) {
          return accum + elem.price;
      }, 0)
    return total;
  }

  $scope.tax = function(value) {
    return value * .04
  }
})

