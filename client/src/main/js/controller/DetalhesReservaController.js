(() => {
    'use-strict';
    /**
     * Controller responsável pelo modal de detalhes da reserva.
     */
    angular.module('calendarioModulo').controller('DetalhesReservaController', ['reserva', 'data', '$mdDialog', 'ModalService', 'AuthService', 'AgendamentoService', function (reserva, data, $mdDialog, ModalService, AuthService, AgendamentoService) {

        const self = this;

        this.reserva = reserva;

        this.reservaOriginal;

        this.isEdicao = !reserva.autor;

        /**
         * Ativa o modo de edição de reserva.
         */
        this.toggleEdicao = () => {
            preEdicao();
            self.isEdicao = true;
        };

        /**
         * Operações que devem ser realizadas antes do início da edição de reserva.
         * -Copiar agendamento para editar um objeto separado. (necessário para desfazer ou descartar)
         * -Ajustar hora de início e fim para Date
         */
        function preEdicao() {
            self.reservaOriginal = self.reserva;
            self.reserva = angular.copy(self.reserva);
            ajustarInicioFim();
        }

        /**
         * Ajusta a hora de início e fim para edição da reserva.
         * Para a edição funcionar corretamente os mesmos devem ser objetos
         * Date.
         */
        function ajustarInicioFim() {
            const inicio = new Date();
            const fim = new Date();

            const horaInicio = self.reserva.inicio.split(':')[0];
            const minutosInicio = self.reserva.inicio.split(':')[1];

            const horaFim = self.reserva.fim.split(':')[0];
            const minutosFim = self.reserva.fim.split(':')[1];

            inicio.setHours(horaInicio);
            inicio.setMinutes(minutosInicio);
            inicio.setSeconds(0);
            inicio.setMilliseconds(0);

            fim.setHours(horaFim);
            fim.setMinutes(minutosFim);
            fim.setSeconds(0);
            fim.setMilliseconds(0);

            self.reserva.inicio = inicio;
            self.reserva.fim = fim;
        }

        /**
         * Cria a reserva.
         * @return Promise.
         */
        this.salvarReserva = () => {
            preSalvar();
            return AgendamentoService.salvarReserva(data, this.reserva)
                .then(data => {
                    self.isEdicao = false;
                    posSalvar(data);
                    return data;
                }, err => {
                    // desfaz o inicio e fim para date, caso falhe.
                    ajustarInicioFim();
                    ModalService.error(err.mensagem)
                        .then(() => {
                            self.reserva.autor = undefined;
                            ModalService.verReserva(self.reserva, data);
                        });
                });
        };

        /**
         * Operações que devem ser executadas antes do salvamento de agendamento.
         * -Limpar horas de início e fim de Date para String
         */
        function preSalvar() {
            limparHoraInicioFim();
        }

        /**
         * Operações que devem ser executadas após o salvamento de agentamento.
         * -Copiar os dados do agendamento para o antigo (necessário apenas para não precisar recarregar o dia)
         * @param {*} data Dados retornados após salvamento.
         */
        function posSalvar(data) {
            angular.copy(data, self.reservaOriginal);
        }

        /**
         * Limpa o horário de início e fim da reserva, para obter o formato
         * HH:MM cada um.
         */
        function limparHoraInicioFim() {
            const inicio = self.reserva.inicio;
            const fim = self.reserva.fim;

            const horaInicio = inicio.getHours();
            const minutosInicio = inicio.getMinutes();
            const inicioFormatado = `${horaInicio > 9 ? horaInicio : '0' + horaInicio}:${minutosInicio === 0 ? '00' : minutosInicio > 9 ? minutosInicio : '0' + minutosInicio}`;
            const horaFim = fim.getHours();
            const minutosFim = fim.getMinutes();
            const fimFormatado = `${horaFim > 9 ? horaFim : '0' + horaFim}:${minutosFim === 0 ? '00' : minutosFim > 9 ? minutosFim : '0' + minutosFim}`;

            self.reserva.inicio = inicioFormatado;
            self.reserva.fim = fimFormatado;
        }

        /**
         * Exclui a reserva.
         * @return Promise.
         */
        this.excluirReserva = () => {
            return AgendamentoService.excluir(data, this.reserva).then(data => {
                this.fecharModal();
                return data;
            });
        };

        /**
         * Indica se o usuário logado é dono da reserva.
         * @return True se o usuário for o dono da reserva.
         */
        this.ehDonoDaReserva = () => {
            // TODO: verificar por ID ou algo assim.
            return reserva.autor === getNomeUsuarioLogado();
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
                this.descartarMudancas();
            }
            $mdDialog.hide('close');
        };

        /**
         * Descarta as mudanças atuais.
         */
        this.descartarMudancas = () => {
            angular.copy(this.reservaOriginal, this.reserva);
            this.isEdicao = false;
        };

        /**
         * Indica se existem mudanças na reserva.
         * @return True se houverem mudanças.
         */
        function temMudancas() {
            // TODO: precisamos melhorar isso?
            return self.isEdicao;
        }

        function getNomeUsuarioLogado() {
            const usuarioLogado = AuthService.getLoggedUser();
            return usuarioLogado.user_metadata.nome_completo;
        }

        (() => {
            if (self.isEdicao) {
                reserva.autor = getNomeUsuarioLogado();
            }
        })();
    }]);
})();