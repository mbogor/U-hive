'use strict';

app.directive('taskItem', function() {
  return {
    restrict: 'E',
    templateUrl: '/js/tasks/task.item.html',
    controller:'TaskItem'
  };
});
