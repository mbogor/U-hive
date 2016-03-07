'use strict';

app.directive('cartItem', function(){
  return {
    restrict: 'E',
    templateUrl: '/js/cart/cart.item.html',
    controller: 'CartItemCtrl'
  };
})

app.controller('CartItemCtrl', function(){

})
