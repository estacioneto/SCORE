(() => {
    'use strict';

    angular.module('localModulo').component('listagemLocais', {
        templateUrl: 'view/component/local/listagem-locais.html',
        bindings: {
            onClickLocal: '&'
        },
        controller: ['$scope', '$window', 'LocaisService', function ($scope, $window, LocaisService) {

            const self = this;
            const MIN_WIDTH = 600, CARD_WIDTH = 250, MAX_COLUMNS = 4;

            this.locais = [];

            this.selecionarLocal = function (local) {
                this.onClickLocal({local});
            };

            function getMatrizVisualizacaoLocais() {
                const matriz = getMatrizVisualizacaoVazia();
                _.each(self.locais, (local, indice) => {
                    matriz[indice % matriz.length].push(local);
                });
                return matriz;
            }

            function getMatrizVisualizacaoVazia() {
                let width = $window.innerWidth - MIN_WIDTH;
                const matriz = [];
                do {
                    matriz.push([]);
                    width -= CARD_WIDTH;
                } while ((width > 0) && (matriz.length !== MAX_COLUMNS));

                return matriz;
            }

            this.listagemLocais = getMatrizVisualizacaoLocais();

            $scope.$watchCollection(() => this.locais, () => {
                this.listagemLocais = getMatrizVisualizacaoLocais();
            });

            angular.element($window).bind('resize', () => {
                const matrizVazia = getMatrizVisualizacaoVazia();
                if (matrizVazia.length !== this.listagemLocais.length) {
                    this.listagemLocais = getMatrizVisualizacaoLocais();
                    $scope.$digest();
                }
            });

            (() => LocaisService.carregarLocais()
                .catch(err => ModalService.notificarErro(`Falha ao carregar locais. ${(err.data.mensagem || '')}`, err))
                .then(info => {
                    this.locais = info.data;
                    return info;
                })
            )();
        }],
    });
})();
