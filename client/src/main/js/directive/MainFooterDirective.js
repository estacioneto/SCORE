(function () {
    'use strict';

    var footer = angular.module('footerModule', []);

    /**
     * Main footer's directive.
     *
     * @author Estácio Pereira
     */
    footer.directive('mainFooter', ['$state', '$rootScope', 'ModalService', function ($state, $rootScope, ModalService) {
        return {
            restrict: 'AE',
            templateUrl: './view/mainFooter.html',
            link: function (scope, element, attrs) {
                scope.aboutModal = ModalService.aboutModal();
            }
        };
    }]);
})();
