(() => {
    'use strict';

    /**
     * Componente responsável pela exibição do Termo de Condições do local.
     *
     * @param {Local}   local    Local a ter Termo de Condições exibido.
     * @param {Boolean} editavel Booleano informando se o Termo de Condições pode ser editado.
     *
     * @author Estácio Pereira
     */
    angular.module('localModulo').component('termoDeCondicoesLocal', {
        templateUrl: 'view/component/local/termo-de-condicoes-local.html',
        bindings: {
            local: '=',
            editavel: '<'
        },
        controller: ['ModalService', function (ModalService) {

            /**
             * Exibe o modal com o Termo de Condições do local.
             *
             * @param   {event}   $event Evento capturado pelo clique no botão.
             * @returns {Promise} Promise de exibição do modal do Termo de Condições.
             */
            this.mostrarTermoDeCondicoes = ($event) => 
                ModalService.verTermosLocal(this.local, this.editavel, $event);   
        }],
    });
})();
