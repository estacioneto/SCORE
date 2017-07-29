(function () {
    'use strict';

    var loginModule = angular.module('login', []);

    loginModule.controller('LoginController', ['$rootScope', '$state', '$location', 'APP_STATES', 'ToastService', 'AuthService',
        function ($rootScope, $state, $location, APP_STATES, ToastService, AuthService) {
            var self = this;

            this.user = AuthService.getLoggedUser();

            function redirect() {
                $state.go(APP_STATES.HOME.nome);
            }

            (function () {
                if (!_.isEmpty(self.user)) {
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