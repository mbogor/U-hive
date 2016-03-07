'use strict';

app.factory('CollegeFactory', function($http){
  return {
    getAllColleges: function(){
      return $http.get('/api/college')
      .then(function(res){
        console.log('got all colleges:', res.data);
        return res.data;
      });
    }
  };
});
