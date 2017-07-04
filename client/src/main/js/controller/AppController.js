(function () {
    'use strict';

    var appModule = angular.module('app', []);

    /**
     * The app controller. Ideally, it will be empty because we don't need logic on an
     * abstract controller.
     *
     * @author Estácio Pereira
     */
    appModule.controller('AppController', ['AuthService', function (AuthService) {
        this.isAutenticado = () => AuthService.isAuthenticated();
    }]);
}());