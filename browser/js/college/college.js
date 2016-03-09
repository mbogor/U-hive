'use strict';

app.factory('CollegeFactory', function($http){
  return {
    getAllColleges: function(){
      return $http.get('/api/college')
      .then(function(res){
        return res.data;
      });
    }
  };
});
