(() => {
    'use strict';

    /**
     * Validador de campo de funcionamento de local.
     * Valida intervalos da forma HHmmHHmm (início e fim).
     *
     * @author Estácio Pereira.
     */
    angular.module('localModulo').directive('funcionamentoLocalValidator', [function () {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, element, attributes, ngModel) {
                const DIVISOR_HORARIO = 10000;
                const MEIA_NOITE_FIM = 2400,
                    MEIA_NOITE_INICIO = 0;

                /**
                 * Validador do funcionamento de Local.
                 *
                 * @param   {Number}  valor Valor do input, ou seja, do horário.
                 * @returns {boolean} {@code true} se o campo é válido.
                 */
                ngModel.$validators.funcionamentoLocal = function (valor) {
                    if (valor) {
                        const inicio = valor / DIVISOR_HORARIO;
                        const final = valor % DIVISOR_HORARIO;
                        return inicio < final && isHorarioValido(inicio) && isHorarioValido(final);
                    }
                };

                /**
                 * Verifica se um horário do tipo HHmm é válido.
                 *
                 * @param   {Number}  horario Número da forma HHmm.
                 * @returns {boolean} {@code true} se o horário está entre 00 e 2400
                 */
                function isHorarioValido(horario) {
                    return (horario >= MEIA_NOITE_INICIO) && (horario <= MEIA_NOITE_FIM);
                }
            }
        };
    }]);
})();
