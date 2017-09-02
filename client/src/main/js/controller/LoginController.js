(function () {
    'use strict';

    var loginModule = angular.module('login', []);

    loginModule.controller('LoginController', ['$rootScope', '$state', '$location', 'APP_STATES', 'ToastService', 'AuthService',
        function ($rootScope, $state, $location, APP_STATES, ToastService, AuthService) {
            var self = this;

            this.user = AuthService.getUsuarioLogado();

            function redirect() {
                $state.go(APP_STATES.AGENDA_INFO.nome);
            }

            (function () {
                if (!_.isEmpty(self.user)) {
                    console.log('qqqqqqqqq');
                    redirect(self.user);
                }

                // Login de facebook
                var token = $location.search().token;
                if (!_.isUndefined(token)) {
                    AuthService.authenticate(token).then(function (user) {
                        redirect(user);
                    });
                }
            })();
        }]);
}());