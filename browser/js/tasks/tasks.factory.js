'use strict';

app.factory('TaskFactory', function($http){
  var TaskFactory = {};

  TaskFactory.getForSale = function(){
    return $http.get('/api/tasks/forsale')
    .then(function(res){
      return res.data;
    });
  };

  TaskFactory.getDetail = function(id){
    return $http.get('api/tasks/'+id)
    .then(function(task){
      return task.data;
    })
  }

  return TaskFactory;

});
