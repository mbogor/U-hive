app.directive('navbar', function ($rootScope, Session, AuthService, AUTH_EVENTS, $state, localStorageService, UserFactory) {
    var cartCt;
    if(localStorageService.get('cart') && localStorageService.get('cart').tasks.length){
        $rootScope.cartCt = localStorageService.get('cart').tasks.length;
    }else{
        $rootScope.cartCt = 0
    }
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {
            scope.items = [
                { label: 'Home', state: 'home' },
                { label: 'About', state: 'about' },
                { label: 'For Sale', state: 'tasksForSale'},
                { label: 'Top Ten Bees', state: 'topTen'},
                { label: 'Cart (' + $rootScope.cartCt + ')', state: 'cart'},
                { label: 'New Post', state: 'newPost', auth: true},
                { label: 'My Account', state: 'homepage.purchasehistory', auth: true }
            ];

            scope.user = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                    localStorageService.set('cart', {tasks: [], timeCreated: Date.now()});
                    $state.go('home');
                });
            };

            var setUser = function () {
                AuthService.getLoggedInUser()
                .then(function (user) {
                    scope.user = user;
                });
            };

            var setCart = function(){
                if(localStorageService.get('cart').tasks.length){
                        console.log('we  cannot handle this currently');
                }else{
                    UserFactory.getCart(scope.user._id)
                    .then(function(cart){
                        localStorageService.set('cart', {tasks: cart.tasks, timeCreated: cart.timeCreated})
                    });
                }
            }

            var removeUser = function () {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.loginSuccess, setCart);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
