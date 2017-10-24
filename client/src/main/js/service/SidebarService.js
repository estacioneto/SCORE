(() => {
    'use strict';

    /**
     * Service responsável por lidar com lógica de negócio de Sidebar.
     *
     * @author Estácio Pereira.
     */
    angular.module('sidebarModulo', []).service('SidebarService', ['$mdSidenav', function ($mdSidenav) {
        this.SIDEBAR_PRINCIPAL = 'main-sidenav';

        /**
         * Função responsável por abrir e fechar a sidebar.
         */
        this.toggle = function () {
            const sidebar = $mdSidenav(this.SIDEBAR_PRINCIPAL);
            return sidebar.isOpen() ? sidebar.close() : sidebar.toggle();
        };

    }]);
})();