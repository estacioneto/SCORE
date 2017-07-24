(function () {
    'use strict';
    var app = angular.module('scoreApp');

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
                            store.remove('accessToken');
                            $injector.get('$state').go('login');
                        }
                        return $q.reject(rejection);
                    }
                };
            }]);

            /**
             * AuthInterceptor. Envia o user id para o servidor.
             * @param store O armazenamento local
             */
            $provide.factory('APIInterceptor', ['store', function (store) {
                return {
                    request: function (config) {
                        const accessToken = store.get('accessToken');
                        if (accessToken) {
                            config.headers.access_token = accessToken;
                        }
                        return config;
                    }
                };
            }]);

            $httpProvider.interceptors.push('jwtInterceptor');
            $httpProvider.interceptors.push('redirect');
            $httpProvider.interceptors.push('APIInterceptor');

        }]).run(['auth', 'store', 'jwtHelper', function (auth, store, jwtHelper) {
            const token = store.get('idToken');
            if (token) {
                if (!jwtHelper.isTokenExpired(token) && !auth.isAuthenticated) {
                    auth.authenticate(store.get('user'), token);
                }
            }
        }]);
} ());