'use strict';

app.config(function($stateProvider){
  $stateProvider.state('taskDetail', {
    url: '/forsale/:id',
    templateUrl: '/js/tasks/task.detail.html',
    controller: 'ItemCtrl',
    resolve:{
      task: function(TaskFactory, $stateParams){ //this is the injectible thing
        return TaskFactory.getDetail($stateParams.id);
      }
    }
  });
});
