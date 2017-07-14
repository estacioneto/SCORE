(function () {
    "use strict";
    //https://github.com/auth0/auth0-angular

    /**
     * AuthService lida com a lógica de autorização/armazenamento e com questões relacionadas ao auth0 "non view"
     * Também lida com a lógica de usuário(Auth0 profile) porque sua API é fanstástica!
     *
     * @author Estácio Pereira
     */
    angular.module('authModule', []).service('AuthService', ['$http', 'store', '$rootScope', '$q', 'auth', 'Usuario', 'ToastService', function ($http, store, $rootScope, $q, auth, Usuario, ToastService) {
        var self = this;

        /**
         * Autentica o usuário e guarda seu token e user.
         * 
         * @param   {String}  token   O token de identificação do usuário.
         * @param   {Object}  user    O user Auth0.
         * @returns {Promise} Promise retornar user.
         */
        this.authenticate = function (token, user) {
            store.set('idToken', token);
            if (!_.isUndefined(user)) {
                store.set('user', JSON.stringify(user));
                auth.authenticate(user, token);
                return $q.when(user);
            } else {
                return $http.get($rootScope.apiRoot + '/users').then(function (info) {
                    store.set('user', JSON.stringify(info.data));
                    auth.authenticate(info.data, token);
                    return info.data;
                }, function (err) {
                    ToastService.showActionToast({
                        textContent: 'You should login to see your notes!',
                        action: 'OK',
                        hideDelay: 3000
                    });
                });
            }
        };

        /**
         * Verifica se o usuário está autenticado.
         *
         * @returns {Boolean} true se o usuário está autenticado, false caso contrário.
         */
        this.isAuthenticated = function () {
            return auth.isAuthenticated;
        };

        /**
         * Resgata o usuário logado do serviço Auth0
         *
         * @returns {User} O usuário logado.
         */
        this.getLoggedUser = function () {
            return (angular.isString(auth.profile)) ?
                new Usuario(JSON.parse(auth.profile)) : auth.profile;
        };

        /**
         * Retorna o idToken do usuário logado.
         *
         * @returns {String} token
         */
        this.getIdToken = function () {
            return auth.idToken;
        };

        /**
         * Remove as propriedades armazenadas do usuário e encerra a sessão.
         */
        this.logout = function () {
            store.remove('idToken');
            store.remove('user');
            auth.signout();
        };
    }]);
})();
