(function () {
    'use strict';

    var loginModule = angular.module('login', []);

    loginModule.controller('LoginController', ['$rootScope', '$state', '$location', 'ToastService', 'AuthService',
        function ($rootScope, $state, $location, ToastService, AuthService) {
            var self = this;

            this.user = AuthService.getLoggedUser();

            function redirect() {
                $state.go('app.home');
            }

            (function () {
                if (!_.isEmpty(self.user)) {
                    redirect(self.user);
                }

                // Login do facebook
                var token = $location.search().token;
                if (!_.isUndefined(token)) {
                    AuthService.authenticate(token).then(function (user) {
                        redirect(user);
                    });
                }
            })();
        }]);
}());