(() => {
    'use strict';

    /**
     * Service responsável por lidar com lógica de negócio de Sidebar.
     *
     * @author Estácio Pereira.
     */
    class SidebarService {

        /**
         * Construtor do Service.
         *
         * @param {angular.service} $mdSidenav Service responsável pelas sidenavs do Angular Material.
         */
        constructor($mdSidenav) {
            this.$mdSidenav = $mdSidenav;
            this.SIDEBAR_PRINCIPAL = 'main-sidenav';
        }

        /**
         * Função responsável por abrir e fechar a sidebar.
         */
        toggle() {
            const sidebar = this.$mdSidenav(this.SIDEBAR_PRINCIPAL);
            return sidebar.isOpen() ? sidebar.close() : sidebar.toggle();
        }
    }

    /**
     * Definição do Service no Angular.
     */
    angular.module('sidebarModulo', []).service('SidebarService', ['$mdSidenav', SidebarService]);
})();