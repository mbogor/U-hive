app.config(function ($stateProvider) {

    $stateProvider.state('topTen', {
        url: '/topTen',
        templateUrl: '/js/top-ten-bees/top-ten.html',
        controller: 'TopCtrl',
        resolve: {
          topTen: function(UserFactory) {
            return UserFactory.topTenBees();
          }
        }
    });
});

app.controller('TopCtrl', function($scope, topTen, UserFactory, $state){
  $scope.topTenUsers = topTen;
  $scope.hello = "hello"

 $scope.userTransfer = function(id){

    UserFactory.fetchById(id)
    .then(function(user){
    $state.go('publicProfile', {personId: user._id});

    })

  }

});

