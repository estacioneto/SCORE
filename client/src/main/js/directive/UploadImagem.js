(() => {
    'use-strict';
    /**
     * Diretiva que trata a seleção de imagens para upload.
     * @param ngModel Lista a qual as imagens (em base 64) serão adicionadas.
     */
    angular.module('imagemModulo').directive("uploadImagem", ['FileReader', function (FileReader) {
        return {
            template: '<div></div>',
            scope: {
                model: '=ngModel'
            },
            link: function (scope, element) {
                
                /**
                 * Quando o elemento mudar, deve recuperar os arquivos e adicionar no model.
                 */
                element.bind("change", function (e) {
                    const arquivosObj = (e.srcElement || e.target).files;
                    // Não funciona utilizar _.each por não ser um array.
                    for (let i = 0; i < arquivosObj.length; i++) {
                        const arquivo = arquivosObj[i];
                        lerArquivo(arquivo);
                    }
                });

                /**
                 * Realiza a leitura do arquivo e o transforma em bas64, em seguida
                 * adiciona no model.
                 * 
                 * @param {File} arquivo 
                 */
                function lerArquivo(arquivo) {
                    FileReader.readAsDataUrl(arquivo, scope)
                        .then(function (urlImagem) {
                            scope.model.push({
                                conteudo: urlImagem
                            });
                        });
                }
            }
        };
    }]);
})();