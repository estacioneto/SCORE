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
        controller: [function () {
            var self = this;
            const INDICE_IMAGEM_CAPA = 0;
            const IMAGEM_DEFAULT = 'img/icons/ufcg-360x388.png';

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
                if(self.possuiImagens()) return self.local.imagens[INDICE_IMAGEM_CAPA].conteudo;
                return IMAGEM_DEFAULT;
            };
        }],
    });
})();
