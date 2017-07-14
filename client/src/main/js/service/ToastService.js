(function () {
    'use strict';

    var toast = angular.module('toastModule', []);

    toast.service('ToastService', ['$mdToast', function ($mdToast) {
        var self = this;
        var FOUR_SECONDS = 4000;
        var THREE_SECONDS = 3000;

        /**
         * Mostra um toast de ação e retorna o promise toast.
         *
         * @param   {Object}  options Objeto contento todos as opções custom.
         * @returns {promise} promise toast.
         */
        this.showActionToast = function (options) {
            if (!_.isObject(options)) {
                options = {
                    textContent: options,
                    action: 'OK',
                    position: 'bottom left',
                    hideDelay: THREE_SECONDS
                };
            }
            var toast = $mdToast.simple()
                .textContent(options.textContent)
                .action(options.action || 'DONE')
                .highlightAction(options.highlightAction || true)
                .hideDelay(options.hideDelay || false)
                .position(options.position || 'top right');
            return $mdToast.show(toast);
        };

        /**
         * Mostra um 'UNDO' toast.
         *
         * @param   {Object}  options Objeto contento todos as opções custom.
         * @returns {promise} promise toast.
         */
        this.showUndoToast = function (options) {
            options.action = options.action || 'UNDO';
            options.hideDelay = options.hideDelay || FOUR_SECONDS;
            return self.showActionToast(options);
        };
    }]);
})();
