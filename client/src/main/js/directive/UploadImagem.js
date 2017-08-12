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
                        if (validarArquivo(arquivo))
                            lerArquivo(arquivo);
                    }
                });

                /**
                 * Realiza a validação do arquivo de entrada.
                 * - O arquivo não pode ter mais de 16 MB.
                 * - O arquivo precisa ser do tipo PNG, JPG, JPEG, GIF ou BITMAP.
                 * 
                 * @param {File} arquivo Arquivo a ser validado
                 * @return {Boolean} True caso o arquivo seja válido
                 */
                function validarArquivo(arquivo) {
                    // 16 MB
                    const TAM_MAX = 16 * 1000 * 1000;
                    const TIPOS = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/bitmap'];
                    if (arquivo.size > TAM_MAX) {
                        alert(`O tamanho máximo suportado é de 16 MB. ${arquivo.name}`);
                        return false;
                    }
                    const tipoNaoListado = _.findIndex(TIPOS, tipo => tipo === arquivo.type) === -1;
                    if (tipoNaoListado) {
                        alert(`Tipo de imagem não suportado. ${arquivo.name}`);
                        return false;
                    }
                    return true;
                }

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