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

app.controller('TopCtrl', function($scope, topTen){
  $scope.topTenUsers = topTen;
  $scope.hello = "hello"
});

