(() => {
    'use strict';

    /**
     * Factory de Local.
     *
     * @author Estácio Pereira.
     */
    angular.module('localModulo', []).factory('Local', [function () {

        const PRIMEIRO_INDICE = 0,
            HORA_INICIO_INDICE = 2,
            MINUTO_INICIO_INDICE = 4,
            HORA_FIM_INDICE = 6;

        /**
         * Construtor do local.
         *
         * @param {Object} local Objeto contendo informações do local.
         * @constructor
         */
        function Local(local) {
            this.equipamentos = [];
            this.imagens = [];
            Object.assign(this, local);
        }

        Local.prototype.addEquipamento = function (equipamento) {
            this.equipamentos.push(equipamento);
        };

        Local.prototype.getFuncionamentoFormatado = function () {
            if (this.funcionamento) {
                const horaInicio = this.funcionamento.substring(PRIMEIRO_INDICE, HORA_INICIO_INDICE);
                const minutoInicio = this.funcionamento.substring(HORA_INICIO_INDICE, MINUTO_INICIO_INDICE);
                const horaFim = this.funcionamento.substring(MINUTO_INICIO_INDICE, HORA_FIM_INDICE);
                const minutoFim = this.funcionamento.substring(HORA_FIM_INDICE);

                return `${horaInicio}:${minutoInicio} - ${horaFim}:${minutoFim}`;
            }
        };

        Local.prototype.constructor = Local;

        return Local;
    }]);
})();
