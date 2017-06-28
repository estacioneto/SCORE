(function () {
    'use strict';
    var app = angular.module('pitonApp');

    app.config(['$urlRouterProvider', '$provide', 'authProvider', '$httpProvider', 'jwtInterceptorProvider', 'jwtOptionsProvider',
        function ($urlRouterProvider, $provide, authProvider, $httpProvider, jwtInterceptorProvider, jwtOptionsProvider) {
            authProvider.init({
                domain: AUTH0_DOMAIN,
                clientID: AUTH0_CLIENT_ID
            });

            jwtOptionsProvider.config({
                whiteListedDomains: ['localhost', 'jsonplaceholder.typicode.com'],
                tokenGetter: function () {
                    return (localStorage.getItem('idToken')) ?
                        localStorage.getItem('idToken').toString().replace(/"/g, '') : null;
                }
            });

            $provide.factory('redirect', ['$q', '$injector', 'store', function ($q, $injector, store) {
                return {
                    responseError: function (rejection) {
                        if (rejection.status === 401) {
                            $injector.get('auth').signout();
                            store.remove('user');
                            store.remove('idToken');
                            $injector.get('$state').go('login');
                        }
                        return $q.reject(rejection);
                    }
                };
            }]);

            /**
             * Auth interceptor. Sends the user id to the server.
             * @param store Local storage
             */
            $provide.factory('APIInterceptor', ['store', function (store) {
                return {
                    request: function (config) {
                        var idToken = store.get('idToken');
                        if (idToken) {
                            config.headers.id_token = idToken;
                        }
                        return config;
                    }
                };
            }]);

            $httpProvider.interceptors.push('jwtInterceptor');
            $httpProvider.interceptors.push('redirect');
            $httpProvider.interceptors.push('APIInterceptor');

        }]).run(['$rootScope', 'auth', 'store', 'jwtHelper', function ($rootScope, auth, store, jwtHelper) {
            const token = store.get('idToken');
            if (token) {
                if (!jwtHelper.isTokenExpired(token) && !auth.isAuthenticated) {
                    auth.authenticate(store.get('user'), token);
                }
            }
        }]);
} ());