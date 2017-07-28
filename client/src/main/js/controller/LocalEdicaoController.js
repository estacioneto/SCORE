(() => {
    'use strict';

    angular.module('localModulo').controller('LocalEdicaoController', ['$state', 'APP_STATES', 'Local', 'local', 'LocaisService', 'ModalService', 'ToastService', function ($state, APP_STATES, Local, local, LocaisService, ModalService, ToastService) {

        const self = this;
        this.local = local || new Local();
        this.localBackup;

        /**
         * Salva o local atual redirecionando para tela de visualização do mesmo em caso
         * de sucesso, ou exibindo um modal de erro caso contrário.
         */
        this.salvarLocal = function () {
            function callbackSucesso(data) {
                self.local = data.data;
                const mensagem = 'Local salvo com sucesso!';
                ToastService.showActionToast(mensagem);
                $state.go(APP_STATES.LOCAL_ID_INFO.nome, {idLocal: self.local._id});
            }

            function callbackErro() {
                const mensagem = 'Um erro ocorreu, o local não foi salvo. Por favor, ' +
                    'tente novamente.';
                ModalService.error(mensagem);
            }

            LocaisService.salvarLocal(self.local)
               .then(callbackSucesso)
               .catch(callbackErro);
        };

        /**
         * Verifica se há necessidade de limpar os campos, se sim, limpa-os, se não,
         * não executa ação.
         */
        this.limparCampos = function () {
            if (podeLimparCampos()) {
                limparCampos();
            }
        };

        /**
         * Limpa todos os campos, fornecendo ao usuário a opção de desfazer a limpeza.
         */
        function limparCampos() {
            preLimparCampos();

            const opcoesToast = {
                textContent: 'Campos limpos com sucesso!',
                position: 'bottom left'
            };

            ToastService.showUndoToast(opcoesToast).then(info => {
                if (info) { desfazerLimpezaDeCampos(); }
            });
        }

        /**
         * Checa se os campos do formulário podem ser limpos.
         *
         * @return {boolean} {@code true} caso o local atual tenha algum campo a ser
         * limpo, {@code false} caso contrário.
         *
         * FIXME: Os array inicializados (e.g. equipamentos) são retornados pelo _.values() como vazios,
         * FIXME: porém ainda contam como atributos, então a lista de atributos nunca é vazia.
         */
        function podeLimparCampos() {
            const local = angular.copy(self.local);
            delete local._id;

            const atributosLocal = _.values(local);
            return !_.isEmpty(atributosLocal);
        }

        /**
         * Realiza backup das informações do local antes de limpar todos os campos
         * do formulário.
         */
        function preLimparCampos() {
            self.localBackup = angular.copy(self.local);
            self.local = new Local();
        }

        /**
         * Desfaz a limpeza de campos.
         */
        function desfazerLimpezaDeCampos() {
            self.local = angular.copy(self.localBackup);
        }

    }]);
})();
