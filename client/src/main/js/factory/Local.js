(() => {
    'use strict';

    /**
     * Factory de Local.
     *
     * @author Estácio Pereira.
     */
    angular.module('localModulo').factory('Local', [function () {

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

        /**
         * Adiciona um equipamento ao local.
         *
         * @param equipamento Equipamento a ser adicionado.
         */
        Local.prototype.addEquipamento = function (equipamento) {
            this.equipamentos.push(equipamento);
        };

        /**
         * Retorna o horário de início do funcionamento, no formato hh:mm, do local.
         *
         * @return {string} Horário de início do funcionamento do local.
         */
        Local.prototype.getInicioFuncionamento = function () {
            if (this.funcionamento) {
                const horaInicio = this.funcionamento.substring(PRIMEIRO_INDICE, HORA_INICIO_INDICE);
                const minutoInicio = this.funcionamento.substring(HORA_INICIO_INDICE, MINUTO_INICIO_INDICE);

                return `${horaInicio}:${minutoInicio}`;
            }
        };

        /**
         * Retorna o horário de fim do funcionamento, no formato hh:mm, do local.
         *
         * @return {string} Horário de fim do funcionamento do local.
         */
        Local.prototype.getFimFuncionamento = function () {
            if (this.funcionamento) {
                const horaFim = this.funcionamento.substring(MINUTO_INICIO_INDICE, HORA_FIM_INDICE);
                const minutoFim = this.funcionamento.substring(HORA_FIM_INDICE);

                return `${horaFim}:${minutoFim}`;
            }
        };

        /**
         * Retorna o horário de funcionamento, no formato 'hh:mm - hh:mm', do local.
         *
         * @return {string} Horário de funcionamento do local.
         */
        Local.prototype.getFuncionamentoFormatado = function () {
            if (this.funcionamento) {
                const inicioFormatado = this.getInicioFuncionamento();
                const fimFormatado = this.getFimFuncionamento();

                return `${inicioFormatado} - ${fimFormatado}`;
            }
        };

        Local.prototype.constructor = Local;

        return Local;
    }]);
})();
