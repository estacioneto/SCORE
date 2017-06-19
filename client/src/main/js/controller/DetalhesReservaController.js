(() => {
    'use-strict';
    /**
     * Controller responsável pelo modal de detalhes da reserva.
     */
    angular.module('calendarioModulo').controller('DetalhesReservaController', ['reserva', '$mdDialog', 'ModalService', function (reserva, $mdDialog, ModalService) {

        const self = this;

        this.reserva = reserva;

        this.isEdicao = false;

        /**
         * Ativa o modo de edição de reserva.
         */
        this.toggleEdicao = () => {
            self.isEdicao = true;
        };

        /**
         * Cria a reserva.
         * @return Promise.
         */
        this.salvarReserva = () => {
            // usuario logado
            reserva.autor = 'Eric Breno';
            return this.reserva.salvar().then(data => {
                self.isEdicao = false;
                return data;
            });
        };

        /**
         * Exclui a reserva.
         * @return Promise.
         */
        this.excluirReserva = () => {
            return this.reserva.excluir().then(data => {
                this.fecharModal();
                return data;
            });
        };

        /**
         * Indica se o usuário logado é dono da reserva.
         * @return True se o usuário for o dono da reserva.
         */
        this.ehDonoDaReserva = () => {
            return reserva.autor === 'Eric Breno';
        };

        /**
         * Indica se o usuário logado pode criar a reserva.
         * @return True se não houver uma reserva já criada.
         */
        this.podeCriarReserva = () => {
            return !reserva.autor && !this.isEdicao;
        };

        this.podeExcluir = () => {
            return this.ehDonoDaReserva() && !this.isEdicao;
        };

        this.podeEditar = () => {
            return this.ehDonoDaReserva() && !this.isEdicao
        };

        /**
         * Fecha o modal de detalhes, cancelando as edições realizadas.
         */
        this.fecharModal = () => {
            if (temMudancas()) {
                this.descartarMudancas().then(() => {
                    $mdDialog.hide('close');
                });
            } else {
                $mdDialog.hide('close');
            }
        };

        /**
         * Descarta as mudanças atuais, recarregando a reserva.
         * @return Promise do load.
         */
        this.descartarMudancas = () => {
            return self.reserva.carregar().then(() => {
                self.isEdicao = false;
            });
        };

        /**
         * Indica se existem mudanças na reserva.
         * @return True se houverem mudanças.
         */
        function temMudancas() {
            return self.isEdicao;
        };
    }]);
})();