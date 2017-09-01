(() => {
    'use strict';
    /**
     * Controller responsável pela view do calendário.
     *
     */
    angular.module("agendaModulo", []).controller("AgendaController", ['$scope', '$compile', '$filter', '$state', 'uiCalendarConfig', 'APP_STATES',
        'Reserva', 'DataManipuladorService', 'LocaisService', 'ModalService', 'TIPOS_RESERVA', 'AgendamentoService', '$q', 'AuthService', 'PERMISSOES', 'local',
        function ($scope, $compile, $filter, $state, uiCalendarConfig, APP_STATES, Reserva, DataManipuladorService, LocaisService, ModalService, TIPOS_RESERVA, AgendamentoService, $q, AuthService, PERMISSOES, local) {

            const self = this;

            this.local = local;
            this.reservasSource = [];

            this.tiposReserva = TIPOS_RESERVA;

            /**
             * Callback executado quando o usuário clica em uma determinada reserva.
             * Aqui exibimos o Modal com as informações sobre a reserva.
             *
             * @param reserva Reserva clicado.
             * @return {Promise} Promise do modal de visualização da reserva
             */
            this.visualizarReserva = function (reserva) {
                const reservaObj = new Reserva(reserva);
                return ModalService.verReserva(reservaObj, self.local).then(info => {
                    uiCalendarConfig.calendars.calendario.fullCalendar('removeEvents');
                    uiCalendarConfig.calendars.calendario.fullCalendar('addEventSource', _.first(self.reservasSource));
                    return info;
                });
            };

            /**
             * Callback executado quando o usuário clica em um determinado dia.
             * Temos que decidir qual será o comportamento executado, pois podemos manter o usuário
             * na mesma tela e apenas alterar a visualização do calendário para o dia clicado, ou
             * podemos fazer o que estava sendo feito antes, redirecioná-lo para outra tela, visuali-
             * zando apenas o dia clicado.
             *
             * @param data Data clicado.
             */
            this.clickDia = function (data) {
                const calendario = uiCalendarConfig.calendars.calendario;

                if (calendario.fullCalendar('getView').type === 'agendaDay' ||
                    calendario.fullCalendar('getView').type === 'agendaWeek') {
                    if (data.isAfter(moment())) {
                        self.criarReserva(data.toDate());
                    }
                } else {
                    calendario.fullCalendar('changeView', 'agendaDay', data);
                }
            };

            /**
             * Objeto enviado à diretiva do calendário com todas as configurações desejadas.
             * Consultar: https://fullcalendar.io/docs/
             */
            this.calendarioConfig = {
                calendario: {
                    height: "100%",
                    editable: false,
                    ignoreTimezone: false,
                    timezone: 'local',
                    lang: 'pt-br',
                    header: {
                        left: 'month agendaWeek agendaDay',
                        center: 'title',
                        right: 'today prev,next'
                    },
                    displayEventEnd: true,
                    views: {
                        month: {
                            eventLimit: 4
                        }
                    },
                    eventClick: self.visualizarReserva,
                    dayClick: self.clickDia,
                    eventAfterAllRender: transformaBotoesCalendario,
                    buttonText: {
                        agendaWeek: 'Semana',
                        agendaDay: 'Dia'
                    }
                }
            };

            /**
             * Abre o modal para criação de reserva no dia especificado, caso o usuário tenha a
             * permissão necessária para tal.
             *
             * @return {Promise} Promise do modal.
             */
            this.criarReserva = (data) => {
                if (AuthService.userTemPermissao(PERMISSOES.RESERVAS)) {
                    const reserva = new Reserva({
                        dia: DataManipuladorService.parseData(data),
                        inicio: DataManipuladorService.getHorarioEmString(data),
                        localId: self.local._id
                    });

                    return this.visualizarReserva(reserva);
                }
            };

            /**
             * Retorna a visualização para listagem de calendários.
             */
            this.voltaParaListagem = () => $state.goBack(APP_STATES.AGENDA_INFO.nome);

            /**
             * Redireciona para tela de informações do auditório atual.
             */
            this.visualizarAuditorio = function () {
                $state.go(APP_STATES.LOCAL_ID_INFO.nome, {idLocal: self.local._id});
            };

            /**
             * Retorna um array de reservas contendo apenas as que tem horário de início maior
             * que o horário atual.
             *
             * OBS: Por ora esse método não está sendo utilizado, mas como Eric já implementou
             * e eu acho que pode ser útil, vou deixá-lo aqui por ora. {Vélmer}
             *
             * @param reservas Reservas a serem filtradas.
             * @param data Data em que as reservas especificadas ocorrem.
             * @returns {*} Reservas que iniciam após a hora atual.
             */
            function filtraReservasAtuaisFuturas(reservas, data) {
                const dateAgora = new Date();
                const horaAgora = dateAgora.getHours() + ':' + dateAgora.getMinutes();
                if (DataManipuladorService.isDataFutura(data)) {
                    return reservas;
                }
                if (DataManipuladorService.isHoje(data)) {
                    return reservas.filter(reserva => {
                        return reserva.fim >= horaAgora;
                    });
                }
                return [];
            }

            /**
             * Modifica os botões do calendário para terem os estilos seguindo padrão
             * material, adicionando a classe md-button.
             */
            function transformaBotoesCalendario() {
                const listaBotoes = $('button[class*="fc-button"]');
                const mdButton = "md-button";
                listaBotoes.each(function (i) {
                    if (!$(this).hasClass(mdButton))
                        $(this).addClass(mdButton);
                });
            }

            /**
             * Inicializa as reservas exibidas quando um local é selecionado, exibindo apenas as
             * reservas pertencentes ao mesmo.
             *
             * @return {Promise} Promessa contendo as reservas do local selecionado.
             */
            this.carregarReservas = function () {
                return AgendamentoService.carregarReservasDoLocal(local._id).then(data => {
                    self.reservasSource.splice(0, self.reservasSource.length);
                    const reservas = data.data;
                    self.reservasSource.push(reservas);
                    return data;
                });
            };

            this.carregarReservas();
        }]);
})();