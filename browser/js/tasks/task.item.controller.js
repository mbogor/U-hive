'use strict';

app.controller('TaskItem', function($scope){
  $scope.expandTask =  true;
  $scope.toggleExpand = function(){
    $scope.expandTask=!$scope.expandTask;
  }
})
.filter("trim", function(){
  return function(description, bool){
    if(bool)return description.split(/\s/).slice(0, 10).join(' ');
    return description;
  }
})
