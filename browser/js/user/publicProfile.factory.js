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


  return UserFactory;
})