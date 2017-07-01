(() => {
    'use strict';
    /**
     * Controller responsável pela view do calendário.
     */
    angular.module("calendarioModulo", []).controller("CalendarioController", ['$scope', '$compile', '$filter', '$state', 'Reserva', 'AgendamentoService', 'eventos', 'LocaisService', function ($scope, $compile, $filter, $state, Reserva, AgendamentoService, eventos, LocaisService) {

        const DETALHES_DIA_STATE = 'app.dia';
        const self = this,
              nomeDosDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
              nomeCurtoDosDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
              nomeDosMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
              nomeCurtoDosMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

        this.eventos = eventos;
        this.eventosFonte = [this.eventos];

        /**
         * Callback executado quando o usuário clica em um determinado evento.
         * Aqui exibimos o Modal com as informações sobre o evento.
         *
         * @param calEvent Evento clicado.
         * @param jsEvent Objeto que encapsula informações do clique.
         * @param view View em que o evento foi clicado. E.g. Mês, semana, agenda do dia, etc.
         */
        this.clickEvento = function(calEvent, jsEvent, view) {

            console.log('Evento clicado: ', calEvent);
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
         * @param date Dia clicado.
         * @param jsEvent Objeto que encapsula informações do clique.
         * @param view View em que o evento foi clicado. E.g. Mês, semana, agenda do dia, etc.
         */
        this.clickDia = function(date, jsEvent, view) {
            const fatorFusoHorario = 3;
            date._d.setHours(date._d.getHours() + fatorFusoHorario);

            console.log('Dia clicado: ', date);
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
                header:{
                    left: 'month basicWeek basicDay agendaWeek agendaDay listDay listWeek',
                    center: 'title',
                    right: 'today prev,next'
                },
                views: {
                    day: {
                        displayEventEnd: true
                    },
                    week: {
                        displayEventEnd: true
                    },
                    month: {
                        eventLimit: 4
                    }
                },
                dayNames: nomeDosDias,
                dayNamesShort: nomeCurtoDosDias,
                monthNames: nomeDosMeses,
                monthNamesShort: nomeCurtoDosMeses,
                eventClick: self.clickEvento,
                dayClick: self.clickDia,
                buttonText: {
                    agendaWeek: 'Agenda da semana',
                    agendaDay: 'Agenda do dia',
                    listDay: 'Eventos do dia',
                    listWeek: 'Eventos da semana'
                }
            }
        };

        this.onChangeLocal = function (local) {
            this.local = local;
            // TODO: Implementar mudança de calendário quando auditório selecionado. @author Estácio Pereira.
            console.log('Local selecionado: ', local);
        };

        this.visualizarAuditorio = function () {
            // TODO: Implementar visualização de auditório. @author Estácio Pereira.
            console.log('Local selecionado: ', this.local);
        };

        /**
         * Retorna um array de reservas contendo apenas as que tem horário de início maior
         * que o horário atual.
         *
         * OBS: Por hora esse método não está sendo utilizado, mas como Eric já implementou
         * e eu acho que pode ser útil, vou deixá-lo aqui por ora.
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
         * Verifica se a data é de amanhã ou posterior.
         * @param {*} data 
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