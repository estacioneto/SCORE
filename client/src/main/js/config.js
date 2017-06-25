(function () {
    'use strict';

    const app = angular.module('pitonApp',
        [
            'app',
            'ui.router',
            'ui.bootstrap',
            'ngAria',
            'ngMaterial',
            'ngSanitize',
            'auth0',
            'angular-storage',
            'angular-jwt',
            'auth0.lock',

            // Nossos modulos
            'modalModule',
            'login',
            'authModule',
            'userModule',
            'toolbarModule',
            'toastModule',
            'sidebarModule',
            'searchModule',
            'aboutModule',
            'footerModule',
            'materialCalendar',
            'calendarioModulo',
            'agendamentoModulo',
            'autenticacaoModulo',
            'localModulo'
        ]);

    app.constant('_', window._)
    /**
     * Auth config
     */
        .config(['$urlRouterProvider', '$provide', '$httpProvider',
            function ($urlRouterProvider, $provide, $httpProvider) {

                /**
                 * Adds watchers for requests open and close. While there's an
                 * open request the loading indicator keeps shown.
                 */
                function loadingInterceptor($rootScope, $q) {
                    var _openRequests_ = 0;

                    return {
                        request: function (config) {
                            _openRequests_++;
                            $rootScope.$broadcast('loading_show');
                            return config || $q.when(config);
                        },
                        response: function (response) {
                            if (!(--_openRequests_)) {
                                $rootScope.$broadcast('loading_hide');
                            }
                            return response || $q.when(response);
                        },
                        responseError: function (response) {
                            if (!(--_openRequests_)) {
                                $rootScope.$broadcast('loading_hide');
                            }
                            return $q.reject(response);
                        }
                    };
                }

                $provide.factory('loadingInterceptor', ['$rootScope', '$q', loadingInterceptor]);

                $urlRouterProvider.otherwise('/app/');

                $httpProvider.interceptors.push('loadingInterceptor');
            }])
        /**
         * State config
         */
        .config(['$stateProvider', '$locationProvider', function ($stateProvider, $locationProvider) {
            var view = './view/';
            $stateProvider
                .state('app', {
                    abstract: true,
                    url: '/app',
                    templateUrl: view + 'app.html',
                    controller: 'AppController'
                })
                .state('app.login', {
                    url: '/',
                    templateUrl: view + 'login.html',
                    controller: 'LoginController as loginCtrl'
                })
                .state('app.home', {
                    url: '/home',
                    templateUrl: view + 'home.html',
                    controller: 'CalendarioController as calendarioCtrl'
                })
                .state('app.dia', {
                    url: '/dia?numeroDia&numeroMes&ano',
                    templateUrl: view + 'detalhesDia.html',
                    controller: 'DetalhesDiaController as detalhesCtrl',
                    resolve: {
                        data: $stateParams => {
                            const dia = $stateParams.numeroDia;
                            const mes = $stateParams.numeroMes;
                            const ano = $stateParams.ano;
                            return new Date(ano, mes, dia);
                        }
                    }
                });
            $locationProvider.html5Mode(true);
        }])
        .config(['$mdThemingProvider', function ($mdThemingProvider) {
            $mdThemingProvider.setNonce();
            $mdThemingProvider.theme('default')
                .primaryPalette('indigo', {default: 'A200'})
                .accentPalette('blue', {default: '500'});
        }]);
    app.run(['$rootScope', 'ModalService', function ($rootScope, ModalService) {
        $rootScope._ = window._;
        $rootScope.apiRoot = '/api';

        $rootScope.appPrimaryColor = 'teal';
        $rootScope.appSecondaryColor = 'teal';

        const _modalResp_ = ModalService.loadingIndicatorModal();
        _modalResp_.attach().then(function () {
            $rootScope.$on('loading_show', function () {
                _modalResp_.show();
            });

            $rootScope.$on('loading_hide', function () {
                if (_modalResp_) {
                    _modalResp_.hide();
                }
            });
        });
    }]);
}());
