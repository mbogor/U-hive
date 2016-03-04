app.factory('publicProfileFactory', function($http) {

  var publicProfileFactory = {};

  publicProfileFactory.fetchById = function(id) {
    return $http.get('/api/users/' + id) 
    .then(response => response.data)
  }

  return publicProfileFactory;
})