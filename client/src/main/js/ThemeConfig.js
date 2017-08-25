(() => {
    'use strict';

    const app = angular.module('scoreApp');

    app.config(['$mdThemingProvider', 'TIPOS_RESERVA', function ($mdThemingProvider, TIPOS_RESERVA) {
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
        setDefaultTheme('HOME');
        setDefaultTheme('LOGIN');

        setLocalTheme('LOCAL');

        // --------------- Temas Reserva -------------------
        $mdThemingProvider.theme(TIPOS_RESERVA["Reunião"].mdTheme)
            .primaryPalette('indigo', {default: 'A700'})
            .accentPalette('blue', {default: '500'})
            .warnPalette('red');

        $mdThemingProvider.theme(TIPOS_RESERVA["Videoconferência"].mdTheme)
            .primaryPalette('green', {default: '600'})
            .accentPalette('green', {default: 'A400'})
            .warnPalette('red');

        $mdThemingProvider.theme(TIPOS_RESERVA["Assembleia"].mdTheme)
            .primaryPalette('teal', {default: '700'})
            .accentPalette('teal', {default: 'A400'})
            .warnPalette('red');

        $mdThemingProvider.theme(TIPOS_RESERVA["Defesa"].mdTheme)
            .primaryPalette('purple', {default: '400'})
            .accentPalette('purple', {default: 'A100'})
            .warnPalette('red');

        $mdThemingProvider.theme(TIPOS_RESERVA["Palestra"].mdTheme)
            .primaryPalette('red', {default: 'A700'})
            .accentPalette('red', {default: 'A200'})
            .warnPalette('deep-orange', {default: '500'});

        $mdThemingProvider.theme(TIPOS_RESERVA["Outro"].mdTheme)
            .primaryPalette('amber', {default: '700'})
            .accentPalette('yellow', {default: 'A700'})
            .warnPalette('red');
    }])
})();
