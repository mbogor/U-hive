(function () {

    'use strict';

    // Hope you didn't forget Angular! Duh-doy.
    if (!window.angular) throw new Error('I can\'t find Angular!');

    var app = angular.module('fsaPreBuilt', []);

    app.factory('Socket', function () {
        if (!window.io) throw new Error('socket.io not found!');
        return window.io(window.location.origin);
    });

    // AUTH_EVENTS is used throughout our app to
    // broadcast and listen from and to the $rootScope
    // for important events about authentication flow.
    app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized',
        creationSuccess: 'base-user-created'
    });

    app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        var statusDict = {
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
        };
        return {
            responseError: function (response) {
                console.log('response error:', response.status);
                console.log('response:', response);
                $rootScope.$broadcast(statusDict[response.status], response);
                return $q.reject(response);
            }
        };
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
    });



    // app.service('UnAuthService', function($http, Session, $rootScope, AUTH_EVENTS, $q){

    //     console.log('inside of unath')

    //     function onSuccessfulCreation(response) {
    //         console.log('running success creation', response.data);
    //         var data = response.data;
    //         Session.create(data.id);
    //         // Session.create(data.id, data.user);
    //         $rootScope.$broadcast(AUTH_EVENTS.creationSuccess);
    //         return data.user;
    //     }
        

    //     this.hasSession = function () {
    //         return !!Session.user;
    //     }

    //     this.createUnAuthUser = function() {
    //         if(this.hasSession){
    //             console.log("has session")
    //             return;
    //         } 

    //         // Make request GET /unauthU.
    //         // If it returns a user, call onSuccessfulLogin with the response.
    //         // If it returns a 401 response, we catch it and instead resolve to null.
    //         console.log('GETTING INSIDE OF CREATE UNAUTH USER')
    //         return $http.get('/unauthU')
    //         .then(onSuccessfulCreation)
    //         .catch(function () {
    //             return null;
    //         })

    //     }

    // })

    app.service('AuthService', function ($http, Session, $rootScope, AUTH_EVENTS, $q) {

        function onSuccessfulLogin(response) {
            console.log('running success login', response.data);
            var data = response.data;
            Session.create(data.id, data.user);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            return data.user;
        }

        // Uses the session factory to see if an
        // authenticated user is currently registered.
        this.isAuthenticated = function () {
            return !!Session.user;
        };



        this.getLoggedInUser = function (fromServer) {
            console.log('in AuthService.getLoggedInUser', fromServer);
            // If an authenticated session exists, we
            // return the user attached to that session
            // with a promise. This ensures that we can
            // always interface with this method asynchronously.

            // Optionally, if true is given as the fromServer parameter,
            // then this cached value will not be used.

            if (this.isAuthenticated() && fromServer !== true) {
                return $q.when(Session.user);
            }

            // Make request GET /session.
            // If it returns a user, call onSuccessfulLogin with the response.
            // If it returns a 401 response, we catch it and instead resolve to null.
            return $http.get('/session')
            .then(onSuccessfulLogin)
            .catch(function () {
                return null;
            });

        };

        this.login = function (credentials) {
            return $http.post('/login', credentials)
                .then(onSuccessfulLogin)
                .catch(function () {
                    return $q.reject({ message: 'Invalid login credentials.' });
                });
        };

        this.logout = function () {
            return $http.get('/logout')
            .then(function () {
                console.log('logged out');
                Session.destroy();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
        };

    });
    // this regeisters Session on the app - avail elsewhere. it is a constructor function
    app.service('Session', function ($rootScope, AUTH_EVENTS) {
        console.log('running session service creator');
        var self = this;

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
            console.log('not auth. destroying', self)
            self.destroy();
        });

        $rootScope.$on(AUTH_EVENTS.sessionTimeout, function () {
            console.log('sessionTimeout. destroying', self)
            self.destroy();
        });

        this.id = null;
        this.user = null;

        this.create = function (sessionId, user) {
            console.log('creating session in service')
            this.id = sessionId;
            this.user = user;
        };

        this.destroy = function () {
            console.log('destroying session in service', this);
            this.id = null;
            this.user = null;
        };

    });

})();
