(() => {
    'use strict';
    /**
     * Controller responsável pela view do calendário.
     */
    angular.module("calendarioModulo", []).controller("CalendarioController", ['$scope', '$compile', '$filter', '$state', 'uiCalendarConfig', 'Reserva', 'AgendamentoService', 'reservas', 'LocaisService', 'ModalService', function ($scope, $compile, $filter, $state, uiCalendarConfig, Reserva, AgendamentoService, reservas, LocaisService, ModalService) {

        const self = this;

        this.reservas = reservas;
        this.reservasFonte = [this.reservas];

        /**
         * Callback executado quando o usuário clica em uma determinado reserva.
         * Aqui exibimos o Modal com as informações sobre a reserva.
         *
         * @param reserva Reserva clicado.
         */
        this.clickReserva = function(reserva) {
            return ModalService.verReserva(reserva).then(function () {
                // Todo: Pensar como resolver esse problema da reserva retornar do calendário
                // Todo: como object, não como Reserva. Obs: o updateEvent necessita receber
                // Todo: um objeto com as propriedades de um evento

                let reservaObj = new Reserva(reserva);

                reserva.title = reservaObj.title;
                reserva.description = reservaObj.description;
                reserva.start = reservaObj.start;
                reserva.end = reservaObj.end;

                uiCalendarConfig.calendars.calendario.fullCalendar('updateEvent', reserva);
            });
        };

        /**
         * Callback executado quando o usuário clica em um determinado dia.
         * Temos que decidir qual será o comportamento executado, pois podemos manter o usuário
         * na mesma tela e apenas alterar a visualização do calendário para o dia clicado, ou
         * podemos fazer o que estava sendo feito antes, redirecioná-lo para outra tela, visuali-
         * zando apenas o dia clicado.
         *
         * OBS: Devido ao uso do Locale pt-br (Fuso horário de -3 GMT), o horário do dia retornado
         * está sendo atrasado em 3 horas. Devido a esse problema, a data retornada está sendo sem-
         * pre do dia anterior, pois por exemplo, ao clicarmos no dia 05/07/2017, ele deveria re-
         * tornar a data: 2017-07-05T00:00:00.000Z, porém por retardar 3 horas, a data retornada é
         * 2017-07-04T21:00:00.000Z. Por ora, como não encontrei solução para o problema, estou al-
         * terando manualmente a hora da data para 3 horas na frente.
         *
         * @param dia Dia clicado.
         */
        this.clickDia = function(dia) {
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
                self.criarReserva(dia);
            } else {
                calendario.fullCalendar('changeView', 'agendaDay', dia);
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
                    left: 'month basicWeek basicDay agendaWeek agendaDay listDay listWeek',
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
                    agendaWeek: 'Agenda da semana',
                    agendaDay: 'Agenda do dia',
                    listDay: 'Eventos do dia',
                    listWeek: 'Eventos da semana'
                }
            }
        };

        /**
         * Abre o modal para criação de reserva no dia especificado.
         * @return {Promise} Promise do modal.
         */
        this.criarReserva = (dia) => {
            return ModalService.verReserva(new Reserva({dia: parseDia(dia)}));
        };

        function parseDia(dia) {
            dia = dia._d;
            let diaFormatado = '';

            diaFormatado += `${dia.getDate()}-`;
            diaFormatado += `${dia.getMonth()+1}-`;
            diaFormatado += `${dia.getFullYear()}`;

            return diaFormatado;
        }

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
         * OBS: Por hora esse método não está sendo utilizado, mas como Eric já implementou
         * e eu acho que pode ser útil, vou deixá-lo aqui por ora. {Vélmer}
         *
         * @param reservas Reservas a serem filtradas.
         * @param data Data em que as reservas especificadas ocorrem.
         * @returns {*} Reservas que iniciam após a hora atual.
         */
        function filtraReservasAtuaisFuturas(reservas, data) {
            // return reservas;
            const dateAgora = new Date();
            const horaAgora = dateAgora.getHours() + ':' + dateAgora.getMinutes();
            if (isDataFutura(data)) {
                return reservas;
            }
            if (isHoje(data)) {
                return reservas.filter(reserva => {
                    return reserva.fim >= horaAgora;
                });
            }
            return [];
        }

        /**
         * Retorna se a data especificada é futura em relação a data atual.
         */
        function isDataFutura(data) {
            const agora = new Date(),
                  isAnoFuturo = agora.getFullYear() <= data.getFullYear(),
                  isAnoIgual = agora.getFullYear() === data.getFullYear(),
                  isMesFuturo = agora.getMonth() <= data.getMonth(),
                  isMesIgual = agora.getMonth() === data.getMonth(),
                  isDiaFuturo = agora.getDate() < data.getDate();

            return isAnoFuturo ||
                   (isAnoIgual && isMesFuturo) ||
                   (isAnoIgual && isMesIgual && isDiaFuturo);
        }

        /**
         * Retorna se uma data é o dia atual.
         */
        function isHoje(data) {
            const agora = new Date();
            const isEsseAno = agora.getFullYear() === data.getFullYear();
            const isEsseMes = agora.getMonth() === data.getMonth();
            const isEsseDia = agora.getDate() === data.getDate();
            return isEsseAno && isEsseMes && isEsseDia;
        }

    }]);
})();