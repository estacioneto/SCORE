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
            const self = this;
            Object.defineProperty(this, 'funcionamento', {
                get() {
                    return self._funcionamento;
                },
                set(valor) {
                    const TAMANHO_FUNCIONAMENTO = 8;
                    if (valor && (valor.length === TAMANHO_FUNCIONAMENTO)) {
                        const horarioInicio = valor.substring(PRIMEIRO_INDICE, HORA_INICIO_INDICE);
                        const minutoInicio = valor.substring(HORA_INICIO_INDICE, MINUTO_INICIO_INDICE);
                        self.inicio_funcionamento = `${horarioInicio}:${minutoInicio}`;

                        const horarioFim = valor.substring(MINUTO_INICIO_INDICE, HORA_FIM_INDICE);
                        const minutoFim = valor.substring(HORA_FIM_INDICE);
                        self.fim_funcionamento = `${horarioFim}:${minutoFim}`;
                    }
                    self._funcionamento = valor;
                }
            });

            this.equipamentos = [];
            this.imagens = [];
            this.funcionamento = parseInt(
                local.inicio_funcionamento.split(':').join('') + local.fim_funcionamento.split(':').join('')
            );

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
         * Retorna o horário de funcionamento, no formato 'hh:mm - hh:mm', do local.
         *
         * @return {string} Horário de funcionamento do local.
         */
        Local.prototype.getFuncionamentoFormatado = function () {
            if (this.inicio_funcionamento && this.fim_funcionamento) {
                return `${this.inicio_funcionamento} - ${this.fim_funcionamento}`;
            }
        };

        Local.prototype.constructor = Local;

        return Local;
    }]);
})();