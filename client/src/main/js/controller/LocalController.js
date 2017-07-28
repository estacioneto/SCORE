(() => {
    'use strict';

    angular.module('localModulo').controller('LocalController', ['$state', '$stateParams', 'APP_STATES', 'Local', 'local', 'LocaisService', 'ModalService', 'ToastService', function ($state, $stateParams, APP_STATES, Local, local, LocaisService, ModalService, ToastService) {
        const self = this;

        this.isAdmin = () => true;

        this.edicao = this.isAdmin();
        this.local = local;

        /**
         * Redireciona para tela de detalhes do local, após o mesmo ser clicado.
         * // TODO: Deverá selecionar entre redirecionar para tela de detalhes ou para
         * // TODO: calendário do local.
         *
         * @param local Local clicado.
         */
        this.onChangeLocal = function (local) {
            if (podeRedirecionarLocal(local)) {
                $state.go(APP_STATES.LOCAL_ID_INFO.nome, {idLocal: local._id});
            }
        };

        /**
         * Checa se o local clicado é válido para ser exibido.
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
         * Exclui o local atualmente exibido.
         */
        this.excluirLocal = function () {
            function callbackSucesso() {
                const mensagem = 'Local excluído com sucesso!';
                ToastService.showActionToast(mensagem);
                $state.go(APP_STATES.LOCAL_INFO.nome);
            }

            function callbackErro() {
                const mensagem = 'Um erro ocorreu, o local não foi excluído. Por favor, ' +
                    'tente novamente.';
                ModalService.error(mensagem);
            }

            LocaisService.excluirLocal(self.local._id)
                .then(callbackSucesso)
                .catch(callbackErro);
        };

    }]);
})();
