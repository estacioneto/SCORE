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
            this.clickReserva = function (reserva) {
                const reservaObj = new Reserva(reserva);
                return ModalService.verReserva(reservaObj);
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

                if (isVisualizacaoDiaOuSemana(calendario.fullCalendar('getView'))) {
                    if(data.isAfter(moment())){
                        self.criarReserva(data.toDate());
                    }
                } else {
                    calendario.fullCalendar('changeView', 'agendaDay', data);
                }
            };

            /**
             * Verifica se o calendário está na visualização da semana ou do dia.
             *
             * @param view Tela em que o calendário está renderizado.
             * @return {boolean} {@code true} se o calendário está na visualização
             * da semana ou do dia, {@code false} caso contrário.
             */
            function isVisualizacaoDiaOuSemana(view) {
                return view.type === 'agendaDay' || view.type === 'agendaWeek';
            }

            /**
             * Objeto enviado à diretiva do calendário com todas as configurações desejadas.
             * Consultar: https://fullcalendar.io/docs/
             */
            this.calendarioConfig = {
                calendario: {
                    editable: false,
                    ignoreTimezone: false,
                    timezone: 'local',
                    minTime: self.local.getInicioFuncionamento(),
                    maxTime: self.local.getFimFuncionamento(),
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
                    eventClick: self.clickReserva,
                    dayClick: self.clickDia,
                    eventAfterAllRender: configCalendarioPosRenderizacao,
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

                    return ModalService.verReserva(reserva, this.local);
                }
            };

            /**
             * Retorna a visualização para listagem de calendários.
             */
            this.voltaParaListagem = () => $state.goBack(APP_STATES.AGENDA_INFO.nome);

            /**
             * Redireciona para tela de informações do local atual.
             */
            this.visualizarLocal = function () {
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
             * Executa as configurações que necessitam que o calendário tenha sido
             * renderizado.
             *
             * @param calendarioConfig Objeto que contém informações sobre o calendário
             * renderizado.
             */
            function configCalendarioPosRenderizacao(calendarioConfig) {
                ajustaAltura(calendarioConfig);
                transformaBotoesCalendario();
            }

            /**
             * Ajusta a altura do calendário, após a renderização do mesmo baseado no tipo
             * da sua visualização. Caso a visualização seja do mês, o calendário terá altura
             * máxima, caso seja visualização da semana ou dia, o calendário terá a altura
             * baseada na quantidade de horas exibidas.
             *
             * @param calendarioConfig Objeto que contém informações sobre o calendário
             * renderizado.
             */
            function ajustaAltura(calendarioConfig) {
                const calendario = uiCalendarConfig.calendars.calendario;

                if (calendario) {
                    const altura = isVisualizacaoDiaOuSemana(calendarioConfig) ? 'auto' : '100%';

                    calendario.fullCalendar('option', 'height', altura);
                }
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
            this.init = function () {
                return AgendamentoService.carregarReservasDoLocal(local._id).then(data => {
                    self.reservasSource.splice(0, self.reservasSource.length);
                    const reservas = data.data;
                    self.reservasSource.push(reservas);
                    return data;
                });
            };

            this.init();
        }]);
})();