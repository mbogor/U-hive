app.factory('PublicProfileFactory', function($http) {

  var PublicProfileFactory = {};

  PublicProfileFactory.fetchById = function(id) {
    return $http.get('/api/users/' + id) 
    .then(response => response.data)
  }

  PublicProfileFactory.fetchAvgRating = function(id) {
  	return $http.get('/api/users/' + id + '/averagerating')
  	.then(response => response.data)
  }

  PublicProfileFactory.getAllReviews = function(id) {
  	return $http.get('/api/users/' + id + '/reviews')
  	.then(response => response.data) 
  }


  return PublicProfileFactory;
})