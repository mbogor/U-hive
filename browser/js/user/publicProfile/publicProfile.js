app.config(function ($stateProvider) {

    $stateProvider.state('publicProfile', {
      url: '/user/:personId',
      templateUrl: 'js/user/publicProfile/user.html',
      controller: 'profileCtrl',
      resolve: {
        theUser: function(UserFactory, $stateParams) {
          return UserFactory.fetchById($stateParams.personId);
        },
        avgRating: function(UserFactory, $stateParams) {
          return UserFactory.fetchAvgRating($stateParams.personId)
        },
        reviewsForUser: function(UserFactory, $stateParams) {
          return UserFactory.getAllReviews($stateParams.personId)
        },
        forSale: function(TaskFactory, $stateParams) {
          return TaskFactory.getForSaleByUser($stateParams.personId)
        }
      }
    })

    $stateProvider.state('publicProfile.forSale', {   
      url: '/forsale',
      templateUrl: 'js/user/privateProfile/subviews/forsale.html',
      controller: 'profileCtrl'    
    });

});

app.controller('profileCtrl', function ($scope, localStorageService, AuthService, theUser, avgRating, reviewsForUser, forSale) {

    $scope.user = theUser;
    $scope.avgRating = Math.round(avgRating);
    $scope.reviews = reviewsForUser;
    $scope.tasks = forSale
    $scope.showReviews = true;
    $scope.expandTask =  true;

    $scope.toggleExpand = function(){
      $scope.expandTask=!$scope.expandTask;
    }

    $scope.addToCart = function(task){
      // AW: this is a promise. you must .then!
      if(AuthService.getLoggedInUser()) {
        console.log('we have a user');
        // do something different
      }
      if(!localStorageService.get('cart')){
        localStorageService.set('cart', {tasks: [], timeCreated: Date.now()});
      }

      var existingCart = localStorageService.get('cart')
      console.log('item is in cart', localStorageService.get('cart').tasks.indexOf(task._id)>-1);
      existingCart.tasks.push(task._id);
      localStorageService.set('cart', existingCart);

    };

    $scope.itemIsInCart = function(task){
      if(!localStorageService.get('cart')) return false;
      return localStorageService.get('cart').tasks.indexOf(task._id)>-1;
    }
})
.filter("trim", function(){
  return function(description, bool){
    if(bool)return description.split(/\s/).slice(0, 10).join(' ');
    return description;
  }
});