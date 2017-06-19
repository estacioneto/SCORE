(function () {
    // AKA eeProc = EasterEggs Processor
    // use: '<eep content="'your message'"></eep>'
    var eeModule = angular.module('aboutModule');

    eeModule.directive('eep', [function () {
        return {
            restrict: 'AE',
            template: '<i>.<md-tooltip md-direction="top">{{ easterEggText }}</md-tooltip><i>',
            scope: {
                easterEggText: '=content'
            }
        };
    }]
    );
} ());