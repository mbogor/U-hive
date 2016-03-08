'use strict';

app.config(function($stateProvider){
  $stateProvider.state('newPost', {
    url: '/newpost',
    templateUrl: '/js/tasks/task.newPost.html',
    controller: 'NewPostCtrl'
  });
});
