(() => {
    'use strict';

    angular.module('localModulo').component('local', {
        templateUrl: 'view/component/local.html',
        bindings: {
            local: '=',
            editavel: '<'
        },
        controller: [function () {
        }],
    });
})();
