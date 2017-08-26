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

            this.possuiImagens = function () {''
                return !_.isEmpty(self.local.imagens);
            };

            this.getImagemDeCapa = function () {
                if(self.possuiImagens()) return self.local.imagens[INDICE_IMAGEM_CAPA].conteudo;
                return IMAGEM_DEFAULT;
            };
        }],
    });
})();
