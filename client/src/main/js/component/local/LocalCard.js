(() => {
    'use strict';

    /**
     * Componente do card de local.
     *
     * @param {Local} local Local a ser exibido.
     *
     * @author Estácio Pereira
     */
    angular.module('localModulo').component('localCard', {
        templateUrl: 'view/component/local/local-card.html',
        bindings: {
            local: '='
        },
        controller: ['LOCAL_IMAGEM', function (LOCAL_IMAGEM) {
            var self = this;

            /**
             * Verifica se o local possui alguma imagem
             * @returns {Boolean} True se o local possui alguma imagem
             */
            this.possuiImagens = function () {
                return !_.isEmpty(self.local.imagens);
            };


            /**
             * Retorna a imagem de capa do local caso o mesmo possua.
             * @returns {String} Imagem de capa do local ou imagem default.
             */
            this.getImagemDeCapa = function () {
                if(self.possuiImagens()){
                    return self.local.imagens[LOCAL_IMAGEM.INDICE_IMAGEM_CAPA].conteudo;
                }
                return LOCAL_IMAGEM.IMAGEM_DEFAULT;
            };
        }],
    });
})();
