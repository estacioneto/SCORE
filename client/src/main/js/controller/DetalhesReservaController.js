(() => {
    'use strict';
    /**
     * Controller responsável pelo modal de detalhes da reserva.
     * 
     */
    angular.module('calendarioModulo').controller('DetalhesReservaController', ['reserva', '$mdDialog', 'ModalService', 'AuthService', 'AgendamentoService', 'Reserva', 'ToastService', 'TIPOS_RESERVA', 'DataManipuladorService', '$q', function (reserva, $mdDialog, ModalService, AuthService, AgendamentoService, Reserva, ToastService, TIPOS_RESERVA, DataManipuladorService, $q) {

        const self = this;

        this.reserva = reserva;

        this.reservaOriginal;

        this.isEdicao = !reserva.autor;

        this.tiposReserva = TIPOS_RESERVA;

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
            self.reserva = new Reserva(angular.copy(self.reserva));
            ajustarInicioFim();
        }

        /**
         * Ajusta a hora de início e fim para edição da reserva.
         * Para a edição funcionar corretamente os mesmos devem ser objetos
         * Date.
         */
        function ajustarInicioFim() {
            const inicio = DataManipuladorService.getHorarioEmDate(self.reserva.inicio);
            const fim = DataManipuladorService.getHorarioEmDate(self.reserva.fim);

            self.reserva.inicio = inicio;
            self.reserva.fim = fim;
        }

        /**
         * Cria a reserva.
         * 
         * @return Promise.
         */
        this.salvarReserva = () => {
            if (!self.reserva.termoAceito) {
                return $q.reject("Você deve aceitar os termos de criação da reserva.");
            }
            self.isEdicao = false;
            preSalvar();

            const callbackReabrirReserva = () => {
                self.reserva.autor = undefined;
                return ModalService.verReserva(self.reserva);
            };
            return self.reserva.salvar().then(data => {
                    AgendamentoService.salvarReserva(self.reserva);
                    ToastService.showActionToast("Reserva atualizada.");
                    posSalvar();
                    return data;
                }, err => {
                    return ModalService.error(err.data).then(callbackReabrirReserva);
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
         */
        function posSalvar() {
            Object.assign(self.reservaOriginal, self.reserva);
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
         * 
         * @return Promise.
         */
        this.excluirReserva = () => {
            ModalService.confirmar("Excluir reserva", "Ação não pode ser desfeita. Confirma?").then(() => {
                return self.reserva.excluir().then(data => {
                    AgendamentoService.excluir(self.reserva);
                    self.fecharModal();
                    ToastService.showActionToast("Reserva excluída.");
                    return data;
                });
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
         * Indica se o usuário logado pode excluir a reserva.
         */
        this.podeExcluir = () => {
            return self.ehDonoDaReserva() && !self.isEdicao;
        };

        /**
         * Indica se a reserva ainda não foi persistida.
         */
        this.isCriacao = () => !self.reserva._id;

        /**
         * Indica se o usuário logado pode editar a reserva.
         */
        this.podeEditar = () => {
            return self.ehDonoDaReserva() && !self.isEdicao
        };

        /**
         * Fecha o modal de detalhes, cancelando as edições realizadas.
         */
        this.fecharModal = () => {
            if (temMudancas()) {
                self.descartarMudancas();
            }
            $mdDialog.hide('close');
        };

        /**
         * Descarta as mudanças atuais.
         */
        this.descartarMudancas = () => {
            if(self.reservaOriginal.autor) {
                angular.copy(self.reservaOriginal, self.reserva);
                self.isEdicao = false;
            } else {
                $mdDialog.hide('close');
            }
        };

        /**
         * Indica se existem mudanças na reserva.
         * 
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
                preEdicao();
                self.reserva.autor = getNomeUsuarioLogado();
            }
        })();
    }]);
})();