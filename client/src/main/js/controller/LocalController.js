(() => {
    'use strict';

    angular.module('localModulo').controller('LocalController', ['$state', '$stateParams', '$q', 'APP_STATES', 'Local', 'local', 'LocaisService', 'ModalService', 'ToastService', function ($state, $stateParams, $q, APP_STATES, Local, local, LocaisService, ModalService, ToastService) {
        const self = this;

        this.isAdmin = () => true;

        this.edicao = this.isAdmin();
        this.local = local;

        /**
         * Redireciona para tela de detalhes do local, após o mesmo ser clicado.
         *
         * @param local Local clicado.
         */
        this.onChangeLocal = function (local) {
            if (podeRedirecionarLocal(local)) {
                $state.go(APP_STATES.LOCAL_ID_INFO.nome, {idLocal: local._id});
            }
        };

        /**
         * Checa se o local clicado é válido para ser exibido, ou seja, caso o local
         * seja definido e não seja o local atual.
         *
         * @param local Local a ser validado.
         * @return {boolean} {@code true} se o local puder ser exibido, {@code false}
         * caso contrário.
         */
        function podeRedirecionarLocal(local) {
            return !!local && (!self.local || (local._id !== self.local._id));
        }

        this.isModoEdicao = () => this.edicao;

        /**
         * Redireciona para tela de criação de local.
         */
        this.adicionarLocal = function () {
            $state.go(APP_STATES.LOCAL_EDICAO.nome);
        };

        /**
         * Redireciona para tela de edição de local.
         */
        this.editarLocal = function () {
            $state.go(APP_STATES.LOCAL_ID_EDICAO.nome, {idLocal: self.local._id});
        };

        /**
         * Exibe modal de confirmação de exclusão.
         */
        this.excluirLocal = function () {
            const titulo = 'Excluir Local',
                mensagem = 'Ação não pode ser desfeita. Confirma?';

            return ModalService.confirmar(titulo, mensagem)
                .then(excluirLocal);
        };

        /**
         * Exclui o local atualmente exibido.
         */
        function excluirLocal() {
            return LocaisService.excluirLocal(self.local._id)
                .then((data) => {
                    const mensagem = 'Local excluído com sucesso!';
                    ToastService.showActionToast(mensagem);
                    $state.go(APP_STATES.LOCAL_INFO.nome);
                    return data;
                })
                .catch(() => {
                    const mensagem = 'Um erro ocorreu, o local não foi excluído. Por favor, ' +
                        'tente novamente.';
                    ModalService.error(mensagem);
                    return $q.reject();
                });
        }

        /**
         * Volta para o state anterior ou vai para a listagem de locais.
         */
        this.voltar = () => $state.goBack(APP_STATES.LOCAL_INFO.nome);

    }]);
})();
