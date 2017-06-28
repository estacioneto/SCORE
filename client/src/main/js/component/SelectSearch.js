(() => {
    'use strict';

    /**
     * Select search genérico.
     *
     * @param {Function} onChangeItem               Função chamada quando o item selecionado for modificado (apagado ou valor diferente).
     * @param {string}   mensagemItemNaoSelecionado Mensagem mostrada quando o item não corresponde a nenhuma opção.
     * @param {string}   titulo                     Título do campo (passado via '@')
     * @param {Array}    opcoes                     Array contendo as opções possíveis de seleção.
     *
     * @author Estácio Pereira.
     */
    angular.module('buscaModulo').component('selectSearch', {
        templateUrl: 'view/component/select-search.html',
        controller: selectSearchController,
        bindings: {
            onChangeItem: '&',
            mensagemItemNaoSelecionado: '<',
            titulo: '@',
            opcoes: '<'
        }
    });

    /**
     * Controller do Select Search
     */
    function selectSearchController() {
        const self = this;

        this.itemSelecionado = undefined;
        this.pesquisa = '';

        /**
         * Retorna os itens filtrados.
         *
         * @return {Array} Array contendo os itens filtrados de acordo com a busca.
         */
        this.itensFiltrados = function () {
            const pesquisa = _.toLower(self.pesquisa);
            return this.opcoes.filter(item => (new RegExp(pesquisa)).test(_.toLower(item.nome)));
        };

        /**
         * Callback executado quando o item selecionado muda.
         *
         * @param   {*} item Item selecionado.
         * @returns {*} Chamada do callback passado para o select search.
         */
        this.onChangeItemSelecionado = function (item) {
            return self.onChangeItem({item});
        };
    }
})();
