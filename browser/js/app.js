'use strict';
window.app = angular.module('FullstackGeneratedApp', ['js-data', 'LocalStorageModule', 'fsaPreBuilt', 'ui.router', 'ui.bootstrap', 'ngAnimate']);

app.config(function ($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');

});
app.config(function(localStorageServiceProvider){
    localStorageServiceProvider
    .setStorageType('sessionStorage') //type of storage
    .setStorageCookie(7,'/'); //number of days before cookies expire & the path they represent(?)
});
// This app.run is for controlling access to specific states.

app.run(function ($rootScope, UnAuthService, $state){

    console.log('INSIDE OF UNAUTH')



    $rootScope.$on('$stateChangeStart', function (event,toState, toParams) {


        // if (!destinationStateRequiresAuth(toState)) {
        //     // The destination state does not require authentication
        //     // Short circuit with return.
        //     return;
        // }
        if (UnAuthService.hasSession()) {

            return;
        }
        
        console.log('about to create unauth user')

        UnAuthService.createUnAuthUser().then(function (user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.

                $state.go(toState.name, toParams);
        });
    })


    //all the unauthenticated user logic will be handled here

})

app.run(function ($rootScope, AuthService, $state) {

    // The given state requires an authenticated user.
   console.log('INSIDE OF AUTH')

    var destinationStateRequiresAuth = function (state) {
        console.log("state", state, "state.data", state.data)
        return state.data && state.data.authenticate;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {


        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        

        AuthService.getLoggedInUser().then(function (user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                $state.go(toState.name, toParams);
            } else {
                $state.go('login');
            }
        });

    });

});

