'use strict';

app.controller('ForSaleCtrl', function($scope, forsale, $state){
  $scope.forsale = forsale; //this is the list of tasks from the resolve block of tasksForSale

  var expandTask =  true;
  $scope.toggleExpand = function(description){
    expandTask=!expandTask;

  }


})
.filter("trim", function(){
  return function(description, bool){
    console.log(this)
    if(bool)return description.split(/\s/).slice(0, 15).join(' ');
    return description;

  }
})
