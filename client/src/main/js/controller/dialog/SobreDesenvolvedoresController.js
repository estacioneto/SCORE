(() => {
    'use strict';

    /**
     * Controller do modal de informações dos desenvolvedores.
     *
     * @author Estácio Pereira.
     */
    angular.module('modalModule').controller('SobreDesenvolvedoresController', ['$http', '$mdDialog', 'ModalService', function ($http, $mdDialog, ModalService) {
        const DESENVOLVEDORES_URI = 'resources/desenvolvedores.json';
        const self = this;

        this.desenvolvedores = [];

        /**
         * Carrega os dados dos desenvolvedores.
         *
         * @returns {Promise} Promise de carregamento.
         */
        function carregarDesenvolvedores() {
            return $http.get(DESENVOLVEDORES_URI)
                .catch(err => ModalService.notificarErro(`Falha ao carregar lista de desenvolvedores. ${(err.data) ? err.data.mensagem : ''}`, err))
                .then(info => {
                    self.desenvolvedores = info.data;
                });
        }

        /**
         * Fecha o modal.
         */
        this.fecharModal = function () {
            $mdDialog.hide('close');
        };

        (() => carregarDesenvolvedores())();
    }]);
})();
