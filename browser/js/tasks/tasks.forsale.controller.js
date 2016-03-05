'use strict';

app.controller('ForSaleCtrl', function($scope, forsale, $state, TaskFactory){
  $scope.forsale = forsale; //this is the list of tasks from the resolve block of tasksForSale



  $scope.detailTransfer = function(id){
    console.log("live from detail transfer")
    TaskFactory.getDetail(id)
    .then(function(task){

      $state.go('taskDetail', {id:task._id});

    })

  }


})


app.controller('ItemCtrl', function($scope, task, $state, TaskFactory){

  $scope.task = task;



})
