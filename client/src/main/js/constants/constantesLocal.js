(() => {
    'use strict';

    angular.module('localModulo', []).constant('LOCAL_IMAGEM', {
        INDICE_IMAGEM_CAPA: 0,
        IMAGEM_DEFAULT: 'img/icons/ufcg-360x388.png',
        MENSAGENS : {
            ALTERAR_CAPA: {
                SUCESSO: 'Imagem de capa redefinida com sucesso.'
            },
            EXCLUIR_IMAGEM: {
                CONFIRMA_TITULO: 'Deletar Imagem',
                CONFIRMA_TEXTO: 'Deseja continuar? Ação não pode ser desfeita.',
                SUCESSO: 'Imagem excluída.',
                ERRO_TITULO: 'Ocorreu um erro ao exlcuir a imagem',
                ERRO_TEXTO: 'Recarregue a página e tente novamente'
            }
        }
    })
})();