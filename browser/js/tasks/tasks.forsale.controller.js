'use strict';

app.controller('ForSaleCtrl', function($scope, forsale, $state, TaskFactory){
  $scope.forsale = forsale; //this is the list of tasks from the resolve block of tasksForSale

  var expandTask =  true;
  $scope.toggleExpand = function(description){
    expandTask=!expandTask;
  }

  $scope.detailTransfer = function(id){
    console.log("live from detail transfer")
    TaskFactory.getDetail(id)
    .then(function(task){

      $state.go('taskDetail', {id:task._id});
      
    })

  }


})
.filter("trim", function(){
  return function(description, bool){
    console.log(this)
    if(bool)return description.split(/\s/).slice(0, 15).join(' ');
    return description;

  }
})

app.controller('ItemCtrl', function($scope, task, $state, TaskFactory){

  $scope.task = task;



})
