(function () {
    'use strict';

    var toolbar = angular.module('toolbarModule', []);

    toolbar.directive('mainToolbar', ['$state', '$rootScope', 'AuthService', 'ToastService', 'SearchService', '$mdSidenav', 'User',
        function ($state, $rootScope, AuthService, ToastService, SearchService, $mdSidenav, User) {
            return {
                restrict: 'AE',
                templateUrl: './view/mainToolbar.html',
                scope: {},
                link: function (scope, element, attrs) {
                    scope.auth = AuthService;

                    /**
                     * The object containing the available states given the current as key.
                     *
                     * @type {{[state]: [{[name]: [string], [icon]: [string]}]}}
                     */
                    scope.availableStates = {
                        'app.home': [{
                            name: 'app.archive',
                            icon: 'fa fa-archive'
                        }],
                        'app.archive': [{
                            name: 'app.home',
                            icon: 'fa fa-home'
                        }]
                    };

                    /**
                     * Function to toggle the sidebar menu
                     */
                    scope.menuFunction = function () {
                        var sidenav = $mdSidenav('main-sidenav');
                        if (sidenav.isOpen()) {
                            sidenav.close();
                        } else {
                            sidenav.toggle();
                        }
                    };

                    /**
                     * @returns {string | undefined} The tag search param.
                     */
                    scope.getSearchedTag = function () {
                        return (SearchService.searchParams.tags) ? SearchService.searchParams.tags.value : undefined;
                    };

                    /**
                     * Removes the tag param and then filters the notes.
                     */
                    scope.removeTag = function () {
                        SearchService.deleteParam('tags');
                        $rootScope.$broadcast('filter');
                    };

                    /**
                     * Configures the Auth0 lock modal.
                     */
                    if (!scope.auth.isAuthenticated()) {
                        // https://auth0.com/docs/libraries/custom-signup#using-lock
                        // user.user_metadata é onde fica os valores dos campos extras
                        scope.lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, LOCK_CONFIG);
                        scope.lock.on('authenticated', authenticate);
                    }

                    scope.user = AuthService.getLoggedUser();

                    /**
                     * Responsible for the logout logic related to the controller
                     * (states and service calls).
                     */
                    scope.logout = function () {
                        scope.auth.logout();
                        $state.go('app.login');
                    };

                    /**
                     * This function is responsible for, basically, show the Auth0 lock modal.
                     */
                    scope.signIn = function () {
                        scope.lock.show();
                    };

                    function redirect(user) {
                        if (user.email_verified) {
                            scope.showActionToast('Your e-mail is verified! You can use the app!');
                            $state.go('app.home');
                        } else {
                            scope.showActionToast('Verify your e-mail and then reload the page!');
                        }
                    }

                    /**
                     * Contains the authentication logic related to the controller after the lock.
                     *
                     * @param authResult The result returned from the lock.
                     */
                    function authenticate(authResult) {
                        return scope.lock.getProfile(authResult.idToken, function (err, user) {
                            if (err) {
                                return console.log('Auth error: ' + error);
                            }
                            scope.user = new User(user);
                            AuthService.authenticate(authResult.idToken, scope.user);
                            redirect(user);
                        });
                    }

                    scope.showActionToast = function (message) {
                        return ToastService.showActionToast({
                            textContent: message,
                            action: 'OK',
                            hideDelay: 5000
                        });
                    };

                    /**
                     * Gets the current state name to show to the user.
                     *
                     * @returns {string} Name shown to the user.
                     */
                    scope.getCurrentStateName = function () {
                        var currentState = $state.current;
                        if (currentState.name !== 'app.home' && currentState.name !== 'app.login') {
                            return scope.getStateName($state.current.name.toUpperCase());
                        }
                        return 'PITON';
                    };

                    /**
                     * Given an state name, gets the last name of it.
                     *
                     * @param   {string} stateName Full name of the state
                     * @returns {string} Last name of the state.
                     */
                    scope.getStateName = function (stateName) {
                        return _.last(stateName.split('.'));
                    };

                    /**
                     * Returns the available states by accessing the current one.
                     *
                     * @returns {Array} List of the available states.
                     */
                    scope.getAvailableStates = function () {
                        var currentState = $state.current.name;
                        return scope.availableStates[currentState];
                    };

                    /**
                     * Simply goes home.
                     */
                    scope.goHome = function () {
                        $state.go(true || scope.auth.isAuthenticated() ? 'app.home' : 'app.login');
                    };
                }
            };
        }]);
})();
