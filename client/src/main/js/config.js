(function () {
    'use strict';

    const app = angular.module('scoreApp',
        [
            'app',
            'ui.router',
            'ui.bootstrap',
            'ui.calendar',
            'ui.mask',
            'ngAria',
            'ngMaterial',
            'ngMessages',
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
            'toolbarModulo',
            'toastModule',
            'sidebarModulo',
            'buscaModulo',
            'aboutModule',
            'footerModule',
            'materialCalendar',
            'calendarioModulo',
            'agendamentoModulo',
            'autenticacaoModulo',
            'localModulo',
            'dataModulo'
        ]);

    app.constant('_', window._)
    /**
     * Auth config
     */
        .config(['$urlRouterProvider', '$provide', '$httpProvider',
            function ($urlRouterProvider, $provide, $httpProvider) {

                /**
                 * Adiciona watchers para requests open e close. Enquanto tiver um 
                 * open request o indicador de carregamento continua visível.
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
            const view = './view/';

            $stateProvider
                .state('app', {
                    abstract: true,
                    url: '/app',
                    templateUrl: view + 'app.html',
                    controller: 'AppController as appCtrl',
                    resolve: {
                        authCheck: function (auth, $state) {
                            if (!auth.isAuthenticated) {
                                $state.go('app.login');
                            }
                        }
                    }
                })
                .state('app.login', {
                    url: '/',
                    templateUrl: view + 'login.html',
                    controller: 'LoginController as loginCtrl'
                })
                .state('app.home', {
                    url: '/home',
                    templateUrl: view + 'home.html',
                    controller: 'CalendarioController as calendarioCtrl',
                    resolve: {
                        reservas: function (AgendamentoService) {
                            return AgendamentoService.loadReservasFuturas();
                        }
                    }
                })
                .state('app.local', {
                    url: '/local',
                    abstract: true,
                    template: '<ui-view/>'
                })
                .state('app.local.info', {
                    url: '',
                    nome: 'local',
                    templateUrl: view + 'local.html',
                    controller: 'LocalController as localCtrl',
                    resolve: {
                        local: () => undefined
                    }
                })
                .state('app.local.id', {
                    url: '/:idLocal',
                    abstract: true,
                    template: '<ui-view/>'
                })
                .state('app.local.id.info', {
                    url: '',
                    nome: 'local',
                    templateUrl: view + 'local.html',
                    controller: 'LocalController as localCtrl',
                    resolve: {
                        local: ($stateParams, LocaisService, Local) => {
                            const id = parseInt($stateParams.idLocal);
                            if (id) {
                                return LocaisService.carregarLocal(id).then(info => new Local(info.data));
                            }
                            return undefined;
                        }
                    }
                })
                .state('app.local.edicao', {
                    url: '/edicao',
                    nome: 'local',
                    templateUrl: view + 'local-edicao.html',
                    controller: 'LocalEdicaoController as localCtrl',
                    resolve: {
                        local: Local => new Local()
                    }
                })
                .state('app.local.id.edicao', {
                    url: '/edicao',
                    nome: 'local',
                    templateUrl: view + 'local-edicao.html',
                    controller: 'LocalEdicaoController as localCtrl',
                    resolve: {
                        local: ($stateParams, LocaisService, Local) => {
                            const id = parseInt($stateParams.idLocal);
                            if (id) {
                                return LocaisService.carregarLocal(id).then(info => new Local(info.data));
                            }
                            return undefined;
                        }
                    }
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
        }]);
    app.run(['$rootScope', 'ModalService', '$transitions', 'auth', '$state', function ($rootScope, ModalService, $transitions, auth, $state) {
        $rootScope._ = window._;
        $rootScope.apiRoot = '/api';

        // Tema da aplicação
        // Transitions? https://github.com/angular-ui/ui-router/issues/2720
        $transitions.onSuccess({}, function ($transition) {
            const state = $transition.to();
            $rootScope.theme = state.name.replace(/\./g, '');
        });

        // Indicador de carregamento
        const _modalResp_ = ModalService.loadingIndicatorModal();
        _modalResp_.attach().then(function () {
            $rootScope.$on('loading_show', function () {
                _modalResp_.show();
            });

            $rootScope.$on('loading_hide', function () {
                _modalResp_.hide();
            });
        });
    }]);
}());
