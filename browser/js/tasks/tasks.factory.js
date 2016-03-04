'use strict';

app.factory('TaskFactory', function($http){
  var TaskFactory = {};

  TaskFactory.getForSale = function(){
    return $http.get('/api/tasks/forsale')
    .then(function(res){
      return res.data;
    });
  };

  return TaskFactory;

});
