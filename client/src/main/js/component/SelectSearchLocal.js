(() => {
    'use strict';

    /**
     * Select search da seleção de local.
     *
     * @param {Function} onSelectLocal Função chamada quando o local selecionado for modificado (apagado ou valor diferente).
     *
     * @author Estácio Pereira.
     */
    angular.module('buscaModulo').component('selectSearchLocal', {
        templateUrl: 'view/component/select-search-local.html',
        controller: ['LocaisService', selectSearchLocalController],
        bindings: {
            onSelectLocal: '&',
            formulario: '='
        }
    });

    /**
     * Controller do Select Search
     */
    function selectSearchLocalController(LocaisService) {
        const self = this;

        this.localSelecionado = undefined;
        this.pesquisa = '';
        this.locais = [];

        /**
         * Retorna os itens filtrados.
         *
         * @return {Array} Array contendo os itens filtrados de acordo com a busca.
         */
        this.locaisFiltrados = function () {
            const pesquisa = _.toLower(self.pesquisa);
            return this.locais.filter(local => (new RegExp(pesquisa)).test(_.toLower(local.nome)));
        };

        /**
         * Callback executado quando o item selecionado muda.
         *
         * @param   {*} local Item selecionado.
         * @returns {*} Chamada do callback passado para o select search.
         */
        this.onChangeLocalSelecionado = function (local) {
            return self.onSelectLocal({local});
        };

        (() => {
            LocaisService.carregarLocais().then(info => {
                self.locais = info.data;
            });
        })();
    }
})();
