(function () {
    'use strict';

    var loginModule = angular.module('login', []);

    loginModule.controller('LoginController', ['$rootScope', '$state', '$location', 'ToastService', 'AuthService',
        function ($rootScope, $state, $location, ToastService, AuthService) {
            var self = this;

            this.user = AuthService.getLoggedUser();

            function redirect(user) {
                $state.go('app.home');
            }

            this.showActionToast = function (message) {
                return ToastService.showActionToast({
                    textContent: message,
                    action: 'OK',
                    hideDelay: 5000
                });
            };

            (function () {
                if (!_.isEmpty(self.user)) {
                    redirect(self.user);
                }

                // Facebook login
                var token = $location.search().token;
                if (!_.isUndefined(token)) {
                    AuthService.authenticate(token).then(function (user) {
                        redirect(user);
                    });
                }
            })();
        }]);
}());