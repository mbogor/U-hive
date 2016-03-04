'use strict';

app.config(function($stateProvider){
  $stateProvider.state('tasksForSale', {
    url: '/forsale',
    templateUrl: '/js/tasks/tasks.forsale.html',
    controller: 'ForSaleCtrl',
    resolve:{
      forsale: function(TaskFactory){ //this is the injectible thing
        return TaskFactory.getForSale();
      }
    }
  });
});
