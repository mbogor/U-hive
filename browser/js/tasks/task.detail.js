'use strict';

app.config(function($stateProvider){
  $stateProvider.state('tasksForSale', {
    url: '/forsale/:id',
    templateUrl: '/js/tasks/task.detail.html',
    controller: 'ForSaleCtrl',
    resolve:{
      detail: function(TaskFactory){ //this is the injectible thing
        return TaskFactory.getDetail(id);
      }
    }
  });
});
