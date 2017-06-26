(function () {
    "use strict";
    //https://github.com/auth0/auth0-angular

    /**
     * AuthService deals with the authorization/storage logic and auth0 'non-view' related questions.
     * Deals with user (Auth0 profile) logic, because it's API is fantastic!
     *
     * @author Estácio Pereira
     */
    angular.module('authModule', []).service('AuthService', ['$http', 'store', '$rootScope', '$q', 'auth', 'Usuario', 'ToastService', function ($http, store, $rootScope, $q, auth, Usuario, ToastService) {
        var self = this;

        /**
         * Authenticates the user and stores the it's token and user.
         * @param   {String}  token   The user's identification token.
         * @param   {Object}  user    The Auth0 user.
         * @returns {Promise} Promise returning the user.
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
         * Verifies if the user is authenticated.
         *
         * @returns {Boolean} true if it's authenticated, false otherwise.
         */
        this.isAuthenticated = function () {
            return auth.isAuthenticated;
        };

        /**
         * Gets the logged user from the Auth0 service.
         *
         * @returns {User} The logged user.
         */
        this.getLoggedUser = function () {
            return (angular.isString(auth.profile)) ?
                new Usuario(JSON.parse(auth.profile)) : auth.profile;
        };

        /**
         * Returns the idToken of the logged user.
         *
         * @returns {String} token
         */
        this.getIdToken = function () {
            return auth.idToken;
        };

        /**
         * Signs out and remove the user's properties from the storage.
         */
        this.logout = function () {
            store.remove('idToken');
            store.remove('user');
            auth.signout();
        };
    }]);
})();
