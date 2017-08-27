(function () {
    'use strict';

    const app = angular.module('scoreApp',
        [
            'app',
            'ui.router',
            'ui.bootstrap',
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
            'footerModule',
            'materialCalendar',
            'agendaModulo',
            'agendamentoModulo',
            'autenticacaoModulo',
            'localModulo',
            'dataModulo',
            'constantesModulo',
            'reservaModulo',
            'imagemModulo'
        ]);

    app.constant('_', window._)
    /**
     * Auth config
     */
        .config(['$urlRouterProvider', '$provide', '$httpProvider',
            function ($urlRouterProvider, $provide, $httpProvider) {

                /**
                 * Adiciona watchers para open e close requests. Enquanto tiver um 
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
        .config(['$stateProvider', '$locationProvider', 'APP_STATES', function ($stateProvider, $locationProvider, APP_STATES) {
            const view = 'view/';

            $stateProvider
                .state(APP_STATES.APP.nome, {
                    abstract: true,
                    url: '/app',
                    templateUrl: view + 'app.html',
                    controller: 'AppController as appCtrl',
                    resolve: {
                        authCheck: function (auth, $state) {
                            if (!auth.isAuthenticated) {
                                $state.go(APP_STATES.LOGIN.nome);
                            }
                        }
                    }
                })
                .state(APP_STATES.LOGIN.nome, {
                    url: '/',
                    templateUrl: view + 'login.html',
                    controller: 'LoginController as loginCtrl'
                })
                .state(APP_STATES.AGENDA.nome, APP_STATES.AGENDA)
                .state(APP_STATES.AGENDA_INFO.nome, APP_STATES.AGENDA_INFO)
                .state(APP_STATES.AGENDA_ID.nome, APP_STATES.AGENDA_ID)
                .state(APP_STATES.LOCAL.nome, {
                    url: '/local',
                    abstract: true,
                    template: '<ui-view/>'
                })
                .state(APP_STATES.LOCAL_INFO.nome, {
                    url: '',
                    nome: 'local',
                    templateUrl: view + 'local.html',
                    controller: 'LocalController as localCtrl',
                    resolve: {
                        local: () => undefined
                    }
                })
                .state(APP_STATES.LOCAL_ID.nome, {
                    url: '/:idLocal',
                    abstract: true,
                    template: '<ui-view/>'
                })
                .state(APP_STATES.LOCAL_ID_INFO.nome, {
                    url: '',
                    nome: 'local',
                    templateUrl: view + 'local.html',
                    controller: 'LocalController as localCtrl',
                    resolve: {
                        local: ($stateParams, LocaisService) => {
                            if ($stateParams.idLocal) {
                                return LocaisService.carregarLocal($stateParams.idLocal).then(info => info.data);
                            }
                            return undefined;
                        }
                    }
                })
                .state(APP_STATES.LOCAL_EDICAO.nome, {
                    url: '/edicao',
                    nome: 'local',
                    templateUrl: view + 'local-edicao.html',
                    controller: 'LocalEdicaoController as localCtrl',
                    resolve: {
                        local: Local => new Local()
                    }
                })
                .state(APP_STATES.LOCAL_ID_EDICAO.nome, {
                    url: '/edicao',
                    nome: 'local',
                    templateUrl: view + 'local-edicao.html',
                    controller: 'LocalEdicaoController as localCtrl',
                    resolve: {
                        local: ($stateParams, LocaisService) => {
                            if ($stateParams.idLocal) {
                                return LocaisService.carregarLocal($stateParams.idLocal).then(info => info.data);
                            }
                            return undefined;
                        }
                    }
                })
                .state(APP_STATES.DIA.nome, {
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
        const THEME_INDEX = 1;

        // Tema da aplicação
        // Transitions? https://github.com/angular-ui/ui-router/issues/2720
        $transitions.onSuccess({}, function ($transition) {
            const state = $transition.to();

            /*
             * Só precisamos distinguir os temas a partir do segundo nome do state, ou seja,
             * app.<nome>, pois os filhos, até o momento, devem ter o mesmo tema.
             */
            $rootScope.theme = state.name.toUpperCase().split(/\./)[THEME_INDEX];
        });

        // Indicador de carregamento
        const _modalResp_ = ModalService.exibirIndicadorCarregamento();
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
