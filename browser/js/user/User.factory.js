app.factory('UserFactory', function($http) {

  var UserFactory = {};

  UserFactory.fetchById = function(id) {
    return $http.get('/api/users/' + id) 
    .then(response => response.data)
  }

  UserFactory.fetchAvgRating = function(id) {
  	return $http.get('/api/users/' + id + '/averagerating')
  	.then(response => response.data)
  }

  UserFactory.getAllReviews = function(id) {
  	return $http.get('/api/users/' + id + '/reviews')
  	.then(response => response.data) 
  }

  UserFactory.getCart = function(id) {
    return $http.get('/api/users/' + id + '/cart')
    .then(response => response.data) 
  }

  UserFactory.getPurchaseHistory = function(id) {
    return $http.get('/api/users/' + id + '/purchasehistory')
    .then(response => response.data) 
  }

  UserFactory.getSalesHistory = function(id) {
    return $http.get('/api/users/' + id + '/saleshistory')
    .then(response => response.data) 
  }

  UserFactory.removeItemFromCart = function(cartId, taskId) {
    return $http.put('/api/cart/' + cartId + '/remove/' + taskId)
    .then(response => response.data)
  }

  return UserFactory;
})