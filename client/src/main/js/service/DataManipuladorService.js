(() => {
    'use strict';

    angular.module('dataModulo', []).service('DataManipuladorService', [function () {

        /**
         * Transforma uma data para o formato yyyy-MM-dd, onde o mês terá uma unidade 
         * incrementada, devido a objetos do tipo Date utilizarem um intervalor de 
         * índices de 0 a 11.
         *
         * @param {Date} data Data a ser transformada para {String}.
         * @return {String} Data formatada.
         */
        this.parseData = data => {
            data = data._d || data;
            let dataFormatada, diaFormatado, mesFormatado, anoFormatado;

            diaFormatado = (data.getDate() < 10) ? `0${data.getDate()}` : `${data.getDate()}`;
            mesFormatado = (data.getMonth() < 9) ? `0${data.getMonth()+1}` : `${data.getMonth()+1}`;
            anoFormatado = `${data.getFullYear()}`;

            dataFormatada = `${anoFormatado}-${mesFormatado}-${diaFormatado}`;

            return dataFormatada;
        };

        /**
         * Retornam, em string, no formato HH:mm o horário da data especificada.
         *
         * @param data Data a ter seu horário formatado. Deve ser do tipo Date ou possuir
         * atributo '_d' to tipo Date.
         * @return {string|undefined} Horário no formato HH:mm ou {@code undefined} caso
         * a data especificada não seja definida.
         */
        this.getHorarioEmString = (data) => {
            if (!data) return undefined;

            data = data._d || data;

            const horarioIndice = 4, horarioInicioIndice = 0, horarioFimIndice = 5, separador = ' ';
            let horarioFormatado, horario;

            horario = _.split(data.toGMTString(), separador)[horarioIndice];
            horarioFormatado = horario.substring(horarioInicioIndice, horarioFimIndice);

            return horarioFormatado;
        };

        /**
         * Retorna, em Date, o horário especificado.
         *
         * @param horario Horário a ser retornado no tipo Date. Deve estar ser do
         * formato HH:mm.
         * @return {Date|undefined} Objeto Date contendo o horário especificado ou
         * {@code undefined} caso o horário especificado não seja definido.
         */
        this.getHorarioEmDate = (horario) => {
            if (!horario) return undefined;

            const horaIndice = 0, minutoIndice = 1, separador = ':';

            const horarioEmDate = new Date(),
                horaInicio = horario.split(separador)[horaIndice],
                minutosInicio = horario.split(separador)[minutoIndice];

            horarioEmDate.setHours(horaInicio);
            horarioEmDate.setMinutes(minutosInicio);
            horarioEmDate.setSeconds(0);
            horarioEmDate.setMilliseconds(0);

            return horarioEmDate;
        };

        /**
         * Retorna se a data especificada é futura em relação a data atual.
         *
         * @param {Date} data
         * @return {Boolean} Retorna {@code true} se a data especificada acontece depois
         * da data atual, {@code false} caso contrário.
         */
        this.isDataFutura = data => {
            return self.isDataMaior(data, new Date());
        };

        /**
         * Verifica se a primeira data é futura à segunda.
         * @param {Date} data1
         * @param {Date} data2
         * @return {Boolean} True se a primeira data for futura.
         */
        this.isDataMaior = (data1, data2) => {
            const isAnoFuturo = data2.getFullYear() <= data1.getFullYear(),
                isAnoIgual = data2.getFullYear() === data1.getFullYear(),
                isMesFuturo = data2.getMonth() <= data1.getMonth(),
                isMesIgual = data2.getMonth() === data1.getMonth(),
                isDiaFuturo = data2.getDate() < data1.getDate();

            return isAnoFuturo ||
                (isAnoIgual && isMesFuturo) ||
                (isAnoIgual && isMesIgual && isDiaFuturo);
        };

        /**
         * Retorna se uma data é o dia atual.
         *
         * @param {Date} data
         * @return {Boolean} Retorna {@code true} se a data especificada é data atual,
         * {@code false} caso contrário.
         */
        this.isHoje = data => {
            const agora = new Date(),
                  isAnoAtual = agora.getFullYear() === data.getFullYear(),
                  isMesAtual = agora.getMonth() === data.getMonth(),
                  isDiaAtual = agora.getDate() === data.getDate();

            return isAnoAtual && isMesAtual && isDiaAtual;
        };
    }]);
})();