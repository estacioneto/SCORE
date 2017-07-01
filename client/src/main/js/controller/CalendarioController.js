(() => {
    'use strict';
    /**
     * Controller responsável pela view do calendário.
     */
    angular.module("calendarioModulo", []).controller("CalendarioController", ['$scope', '$filter', '$state', 'AgendamentoService', 'LocaisService', function ($scope, $filter, $state, AgendamentoService, LocaisService) {

        const DETALHES_DIA_STATE = 'app.dia';
        const self = this;

        // Formatação para o dia.
        this.formatacaoDia = "d";
        // horizontal = calendario, vertical = agenda (listagem)
        this.direcao = 'horizontal';
        // $scope.dayFormat = "EEEE, MMMM d";
        // $scope.direction = 'vertical';

        // Mostrar tooltips
        this.tooltips = true;

        // Deixar como null, pode se iniciar como array para marcar vários dias
        // não usaremos.
        this.dataSelecionada = null;
        // $scope.selectedDate = [];

        // Primeiro dia da semana, 0 = domingo, 1 = segunda, ...
        this.primeiroDia = 0; // First day of the week, 0 for Sunday, 1 for Monday, etc.

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
         * Callback a ser executado quando se clicar em um dia.
         * Vai para tela de detalhes do dia clicado.
         * 
         * @param date Dia clicado.
         */
        this.clickDia = function (date) {
            $state.go(DETALHES_DIA_STATE, {
                numeroDia: date.getDate(),
                numeroMes: date.getMonth(),
                ano: date.getFullYear()
            });
        };

        /**
         * Callback a ser executado quando se clica em avançar para mês anterior.
         * @param data ?
         */
        this.mesAnt = function (data) {
            const msg = "You clicked (prev) month " + data.month + ", " + data.year;
            console.log(msg);
        };

        /**
         * Callback a ser executado quando se clica em avançar para próximo mês.
         * @param data ?
         */
        this.mesProx = function (data) {
            const msg = "You clicked (next) month " + data.month + ", " + data.year;
            console.log(msg);
        };

        /**
         * Define conteúdo para um dado dia. Utilizar para popular o calendário
         * da view principal com eventos. Deve pegar os eventos recuperados do servidor
         * para preencher na view.
         * 
         * Atenção: isto é apenas um callback, chamado pelo calendário automaticamente.
         * @param date Data a se preencher com evento.
         * @return Conteudo a aparecer na data.
         */
        this.carregarConteudoDia = function (date) {
            return AgendamentoService.getReservasDia(date).then(reservas => {
                return getResumoReservas(filtraReservasAtuaisFuturas(reservas, date));
            });
        };

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
            const agora = new Date();
            const isAnoFuturo = agora.getFullYear() <= data.getFullYear();
            const isMesFuturo = agora.getMonth() <= data.getMonth();
            const isDiaFuturo = agora.getDate() < data.getDate();
            return isAnoFuturo && isMesFuturo && isDiaFuturo;
        }

        function isHoje(data) {
            const agora = new Date();
            const isEsseAno = agora.getFullYear() === data.getFullYear();
            const isEsseMes = agora.getMonth() === data.getMonth();
            const isEsseDia = agora.getDate() === data.getDate();
            return isEsseAno && isEsseMes && isEsseDia;
        }

        function getResumoReservas(reservas) {
            let out = '';
            const cores = ["{background: \"blue-200\"}", "{background: \"cyan-300\"}", "{background: \"orange-600\"}", "{background: \"red-400\"}"]
            reservas.sort((a, b) => {
                return a.inicio > b.inicio ? 1 : -1;
            });
            for (let i = 0; i < Math.min(3, reservas.length); i++) {
                out += "<span class='md-caption'>" + reservas[i].titulo + '</span><br>';
            }
            return out;
        }
    }]);
})();