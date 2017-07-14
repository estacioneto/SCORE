(function () {
    'use strict';

    var appModule = angular.module('app', []);

    /**
     * O controller de app. Idealmente ele será vazio, pois não necessitamos de lógica em um abstract controller.
     *
     * @author Estácio Pereira
     */
    appModule.controller('AppController', ['AuthService', function (AuthService) {
        this.isAutenticado = () => AuthService.isAuthenticated();
    }]);
}());