'use strict';

app.factory('TaskFactory', function($http){
  var TaskFactory = {};

  TaskFactory.getForSale = function(){
    return $http.get('/api/tasks/forsale')
    .then(function(res){
      return res.data;
    });
  };

  TaskFactory.newTask = function(task){
    return $http.post('/api/tasks/', task)
    .then(function(res){
      return res.data
    })
  }


  TaskFactory.getDetail = function(id){
    return $http.get('api/tasks/'+id)
    .then(function(task){
      return task.data;
    });
  };

  TaskFactory.getForSaleByUser = function(userId) {
  	return $http.get('/api/tasks/forsale/' + userId)
    .then(function(res){
      return res.data;
    });
  }

  TaskFactory.destroy = function (task) {
    return $http.delete('/api/tasks/'+task._id);
  }
  


  return TaskFactory;

});
