(function () {
    'use strict';

    var appModule = angular.module('app', []);

    /**
     * O controller de app. Idealmente, sera vazio pois nao eh necessario logica em um abstract controller.
     *
     * @author Estácio Pereira
     */
    appModule.controller('AppController', ['AuthService', function (AuthService) {
        this.isAutenticado = () => AuthService.isAuthenticated();
    }]);
}());