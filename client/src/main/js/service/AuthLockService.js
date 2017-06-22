(() => {
    'use strict';

    /**
     * Service responsável por auxiliar no modal (Lock) do Auth0. No momento em que está sendo feito,
     * vale mais a pena do que criar uma tela a parte apesar da suposta complexidade.
     *
     * @author Estácio Pereira.
     */
    angular.module('autenticacaoModulo', []).service('AuthLockService', ['$timeout', function ($timeout) {

        const self = this;

        const PRIMEIRO_INDICE = 0,
            TAMANHO_DDD = 2,
            TAMANHO_NUMERO_METADE = 6,
            TAMANHO_MAXIMO_FORMATADO = 14;

        const TIMEOUT_VERIFICACAO = 500,
            BACKSPACE_KEY = 'Backspace';

        /**
         * Inicializa as verificações necessárias no lock.
         */
        this.inicializarVerificacoes = function () {
            let conteudoLock = _.first(document.getElementsByClassName('auth0-lock-content'));
            if (!conteudoLock) {
                // Caso o conteúdo do lock não tenha sido inicializado, tenta novamente após algum tempo.
                $timeout(self.inicializarVerificacoes, TIMEOUT_VERIFICACAO);
            } else {
                console.log('ok');
                conteudoLock = angular.element(conteudoLock);
                conteudoLock.on('click', evento => {
                    if (clicouEmInscrever(evento)) {
                        verificarNumeroTelefone();
                    }
                });
            }
        };

        /**
         * Verifica se o usuário clicou em botão de 'Inscrever'.
         *
         * @param   {event}   evento Evento do clique.
         * @returns {boolean} {@code true} caso o usuário tenha clicado.
         */
        function clicouEmInscrever(evento) {
            const alvo = _.first(angular.element(evento.target));
            return alvo.innerText === 'Inscrever';
        }

        /**
         * Adiciona a verificação do número de telefone (colocando máscara).
         */
        function verificarNumeroTelefone() {
            const campos = angular.element(document).find('input');
            let campoTelefone = _.find(campos, element => element.name === 'numero_telefone');
            if (!campoTelefone) {
                // Caso o campo não tenha sido inicializado, tenta novamente após algum tempo.
                $timeout(verificarNumeroTelefone, TIMEOUT_VERIFICACAO);
            } else {
                console.log('ok');
                defineFormatacaoTelefone(campoTelefone);
            }
        }

        /**
         * Verifica se deve evitar o caractere no telefone.
         *
         * @param   {event}   evento   Evento de keydown.
         * @param   {string}  telefone Número de telefone atual.
         * @returns {boolean} {@code true} caso o usuário pressionou uma tecla que não deve ir para telefone.
         */
        function evitarCaractereTelefone(evento, telefone) {
            const naoEhNumero = (new RegExp(/(^[^0-9]$)/).test(evento.key));
            const ehNumero = (new RegExp(/(^\d$)/).test(evento.key));

            return (naoEhNumero || (ehNumero && telefone.length === TAMANHO_MAXIMO_FORMATADO)) &&
                !evento.ctrlKey;
        }

        /**
         * Verifica se deve formatar o número.
         *
         * @param   {event}   evento Evento de keydown ou keyup
         * @returns {boolean} {@code true} se deve formatar o número de telefone.
         */
        function deveFormatarTelefone(evento) {
            return evento.key !== BACKSPACE_KEY && !evento.ctrlKey;
        }

        /**
         * Define a formatação de telefone dado o campo.
         *
         * @param {DOMElement} campoTelefone Elemento do campo.
         */
        function defineFormatacaoTelefone(campoTelefone) {
            campoTelefone = angular.element(campoTelefone);
            campoTelefone.on('keydown', evento => {
                if (evitarCaractereTelefone(evento, campoTelefone.val())) {
                    evento.preventDefault();
                }
            });

            campoTelefone.on('keyup', evento => {
                if (deveFormatarTelefone(evento)) {
                    const campo = angular.element(evento.target);
                    formatarNumeroTelefone(campo);
                }
            });
        }

        /**
         * Formata o número de telefone.
         *
         * @param {Object} campo Campo do telefone.
         */
        function formatarNumeroTelefone(campo) {
            const valor = campo.val();
            const numeroNaoFormatado = _.filter(valor, numero => new RegExp(/\d/).test(numero)).join('');
            const numeroFormatado = getTelefoneFormatado(numeroNaoFormatado);

            if (numeroFormatado !== valor) {
                campo.val(numeroFormatado);
            }
        }

        /**
         * Retorna o número de telefone formatado.
         *
         * @param  {string} numeroNaoFormatado Número de telefone não formatado.
         * @return {string} Número de telefone formatado.
         */
        function getTelefoneFormatado(numeroNaoFormatado) {
            if (_.isEmpty(numeroNaoFormatado)) {
                return `(${numeroNaoFormatado}`;
            }

            if (numeroNaoFormatado.length === TAMANHO_DDD) {
                return `(${numeroNaoFormatado}) `;
            }

            if (numeroNaoFormatado.length >= TAMANHO_NUMERO_METADE) {
                const ddd = numeroNaoFormatado.substring(PRIMEIRO_INDICE, TAMANHO_DDD);

                const digitos = numeroNaoFormatado.substring(TAMANHO_DDD);

                return `(${ddd}) ${digitos}`;
            }
        }
    }]);
})();
