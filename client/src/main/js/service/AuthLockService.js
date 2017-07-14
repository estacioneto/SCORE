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

        const TIMEOUT_VERIFICACAO = 500;

        /**
         * Inicializa as verificações necessárias no lock.
         */
        this.inicializarVerificacoes = function () {
            let conteudoLock = _.first(document.getElementsByClassName('auth0-lock-widget-container'));
            if (!conteudoLock) {
                // Caso o conteúdo do lock não tenha sido inicializado, tenta novamente após algum tempo.
                $timeout(self.inicializarVerificacoes, TIMEOUT_VERIFICACAO);
            } else {
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
         * 
         */
        function verificarNumeroTelefone() {
            const campos = angular.element(document).find('input');
            let campoTelefone = _.find(campos, element => element.name === 'numero_telefone');
            if (!campoTelefone) {
                // Caso o campo não tenha sido inicializado, tenta novamente após algum tempo.
                $timeout(verificarNumeroTelefone, TIMEOUT_VERIFICACAO);
            } else {
                const options =  {onKeyPress: function(numero, e, field, options){
                const masks = ['(00) 0000-0000#', '(00) 00000-0000'];
                const mask = (numero.length > 14) ? masks[1] : masks[0];
                    $('[name="numero_telefone"').mask(mask, options);
                }};

                $('[name="numero_telefone"').mask('(00) 00000-0000', options);
            }
        }
    }]);
})();
