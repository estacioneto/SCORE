(() => {
    'use strict';
    /**
     * Controller responsável pela view do calendário.
     * 
     */
    angular.module("calendarioModulo", []).controller("CalendarioController", ['$scope', '$compile', '$filter', '$state', 'uiCalendarConfig',
        'Reserva', 'reservas', 'DataManipuladorService', 'LocaisService', 'ModalService', function ($scope, $compile, $filter, $state, uiCalendarConfig,
                                                                                                    Reserva, reservas, DataManipuladorService, LocaisService, ModalService) {

        const self = this;

        this.reservas = reservas;
        this.reservasFonte = [this.reservas];

        /**
         * Callback executado quando o usuário clica em uma determinada reserva.
         * Aqui exibimos o Modal com as informações sobre a reserva.
         *
         * @param reserva Reserva clicado.
         * @return {Promise} Promise do modal de visualização da reserva
         */
        this.clickReserva = function(reserva) {
            let reservaOriginal = angular.copy(reserva);

            return ModalService.verReserva(reserva).then(function () {
                if(reservaFoiAlterada(reserva, reservaOriginal)) {
                    atualizaReserva(reserva);
                }
            });
        };

        /**
         * Atualiza o horário de início e fim da reserva especificada, utilizando o model
         * Reserva, para buscar os valores em Date.
         *
         * @param reserva Reserva a ter início e fim atualizados.
         */
        function atualizaReserva(reserva) {
            const reservaModelo = new Reserva(reserva);

            reserva.start = reservaModelo.start;
            reserva.end = reservaModelo.end;
        }

        /**
         * Retorna se uma reserva foi alterada.
         *
         * @param reserva Reserva que pode ter sido alterada.
         * @param reservaOriginal Reserva antes da possível alteração
         */
        function reservaFoiAlterada(reserva, reservaOriginal) {
            return JSON.stringify(new Reserva(reserva)) !== JSON.stringify(new Reserva(reservaOriginal));
        }

        /**
         * Callback executado quando o usuário clica em um determinado dia.
         * Temos que decidir qual será o comportamento executado, pois podemos manter o usuário
         * na mesma tela e apenas alterar a visualização do calendário para o dia clicado, ou
         * podemos fazer o que estava sendo feito antes, redirecioná-lo para outra tela, visuali-
         * zando apenas o dia clicado.
         *
         * TODO: Verificar se precisaremos lidar com esse problema do fuso horário
         * OBS: Devido ao uso do Locale pt-br (Fuso horário de -3 GMT), o horário do dia retornado
         * está sendo atrasado em 3 horas. Devido a esse problema, a data retornada está sendo sem-
         * pre do dia anterior, pois por exemplo, ao clicarmos no dia 05/07/2017, ele deveria re-
         * tornar a data: 2017-07-05T00:00:00.000Z, porém por retardar 3 horas, a data retornada é
         * 2017-07-04T21:00:00.000Z. Por ora, como não encontrei solução para o problema, estou al-
         * terando manualmente a hora da data para 3 horas na frente.
         *
         * @param data Data clicado.
         */
        this.clickDia = function(data) {
            /**
             * O prório calendário liga com essa configuração do Locale, então ele sabe que está
             * 3 horas atrasado, por isso a alteração do horário para 3 horas a mais só deve ser
             * feita caso utilizemos o objeto Dia para alguma ação interna.
             *
             * const fatorFusoHorario = 3;
             * dia._d.setHours(dia._d.getHours() + fatorFusoHorario);
             */

            let calendario = uiCalendarConfig.calendars.calendario;

            if (calendario.fullCalendar('getView').type === 'agendaDay' ||
                calendario.fullCalendar('getView').type === 'basicDay') {
                self.criarReserva(data);
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
                editable: true,
                timezone: false,
                lang: 'pt-br',
                header:{
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
                buttonText: {
                    agendaWeek: 'Semana',
                    agendaDay: 'Dia'
                }
            }
        };

        /**
         * Abre o modal para criação de reserva no dia especificado.
         * 
         * @return {Promise} Promise do modal.
         */
        this.criarReserva = (data) => {
            return ModalService.verReserva(new Reserva({dia: DataManipuladorService.parseData(data)}));
        };

        this.onChangeLocal = function (local) {
            this.local = local;
            // TODO: Implementar mudança de calendário quando auditório selecionado. @author Estácio Pereira.
            console.log('Local selecionado: ', local);
        };

        this.visualizarAuditorio = function () {
            $state.go('app.local.id.info', {idLocal: self.local._id});
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

    }]);
})();