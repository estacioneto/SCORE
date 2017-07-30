(() => {
    'use strict';

    /**
     * Componente responsável pela listagem de locais. Ele mesmo carrega os locais a serem listados.
     *
     * @param {Function} onClickLocal Função executada ao clicar em um card de local.
     *
     * @author Estácio Pereira.
     */
    angular.module('localModulo').component('listagemLocais', {
        templateUrl: 'view/component/local/listagem-locais.html',
        bindings: {
            onClickLocal: '&'
        },
        controller: ['$scope', '$window', 'LocaisService', 'ModalService', function ($scope, $window, LocaisService, ModalService) {

            const self = this;
            const MIN_WIDTH = 600, CARD_WIDTH = 250, MAX_COLUMNS = 4;

            this.locais = [];
            this.listagemLocais = [[]];

            /**
             * Função executada ao selecionar um local. Executa callback passado para o componente.
             *
             * @param   {Local} local Local selecionado.
             * @returns {*}     Retorna o que a função {@code onClickLocal} retornar.
             */
            this.selecionarLocal = function (local) {
                return this.onClickLocal({local});
            };

            /**
             * Retorna a matriz de visualização dos locais. Utiliza-se uma matriz para melhorar a visualização
             * dos cards. A utilização do {@code md-grid-list} do Angular Material não é tão intuitiva e aplicável
             * facilmente nessa situação.
             *
             * @returns {Array.<Array.<Local>>} Locais listados distribuidos em uma matriz.
             */
            function getMatrizVisualizacaoLocais() {
                const matriz = getMatrizVisualizacaoVazia();
                _.each(self.locais, (local, indice) => {
                    matriz[indice % matriz.length].push(local);
                });
                return matriz;
            }

            /**
             * Retorna a matriz de visualização dos locais vazia. Determina quantidade de colunas na matriz
             *
             * @returns {Array.Array} Matriz de visualização dos locais vazia.
             */
            function getMatrizVisualizacaoVazia() {
                let width = $window.innerWidth - MIN_WIDTH;
                const matriz = [];
                do {
                    matriz.push([]);
                    width -= CARD_WIDTH;
                } while ((width > 0) && (matriz.length !== MAX_COLUMNS));

                return matriz;
            }

            /**
             * Watcher da lista de locais. Serve para atualizar a matriz da listagem.
             */
            $scope.$watchCollection(() => this.locais, () => {
                this.listagemLocais = getMatrizVisualizacaoLocais();
            });

            /**
             * Event listener do evento de {@code resize}. Diminui ou aumenta a quantidade de colunas na
             * matriz de visualização de locais.
             */
            angular.element($window).bind('resize', () => {
                const matrizVazia = getMatrizVisualizacaoVazia();
                if (matrizVazia.length !== this.listagemLocais.length) {
                    this.listagemLocais = getMatrizVisualizacaoLocais();
                    $scope.$digest();
                }
            });

            /**
             * Função principal. Carrega os locais e monta a matriz de visualização.
             */
            (() => LocaisService.carregarLocais()
                .catch(err => ModalService.notificarErro(`Falha ao carregar locais. ${(err.data.mensagem || '')}`, err))
                .then(info => {
                    this.locais = info.data;
                    this.listagemLocais = getMatrizVisualizacaoLocais();
                    return info;
                })
            )();
        }],
    });
})();
