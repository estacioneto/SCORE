
    angular.module('auth0', ['auth0.service', 'auth0.utils', 'auth0.directives'])
        .run(['auth', function(auth) {
            auth.hookEvents();
        }]);

