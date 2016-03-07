'use strict';

app.controller('ForSaleCtrl', function($scope, forsale, $state, TaskFactory, UserFactory){
  $scope.forsale = forsale; //this is the list of tasks from the resolve block of tasksForSale



  $scope.detailTransfer = function(id){
    console.log("live from detail transfer")
    TaskFactory.getDetail(id)
    .then(function(task){

      $state.go('taskDetail', {id:task._id});

    })

  }

   $scope.sellerTransfer = function(id){
    // console.log("ID FROM SELLER TRANSFER", id)
    UserFactory.fetchById(id)
    .then(function(user){

      $state.go('publicProfile', {personId: user._id});

    })

  }


})


app.controller('ItemCtrl', function($scope, task, $state, TaskFactory){

  $scope.task = task;



})
