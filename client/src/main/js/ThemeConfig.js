(() => {
    'use strict';

    const app = angular.module('scoreApp');

    app.config(['$mdThemingProvider', function ($mdThemingProvider) {
        $mdThemingProvider.setNonce();
        $mdThemingProvider.alwaysWatchTheme(true);

        function setLocalTheme(state) {
            $mdThemingProvider.theme(state.replace(/\./g, ''))
                .primaryPalette('green')
                .accentPalette('light-green')
                .warnPalette('red');
        }

        function setDefaultTheme(state) {
            $mdThemingProvider.theme(state.replace(/\./g, ''))
                .primaryPalette('indigo', {default: 'A200'})
                .accentPalette('blue', {default: '500'});
        }

        setDefaultTheme('default');
        setDefaultTheme('app.home');
        setDefaultTheme('app.login');

        setLocalTheme('app.local.info');
        setLocalTheme('app.local.id');
        setLocalTheme('app.local.id.info');
        setLocalTheme('app.local.edicao');
        setLocalTheme('app.local.id.edicao');
    }])
})();
