(() => {
    'use strict';

    angular.module('dataModulo', []).service('DataManipuladorService', [function () {

        /**
         * Transforma uma data para o formato dd-MM-yyyy, onde o mês terá uma unidade 
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

            dataFormatada = `${diaFormatado}-${mesFormatado}-${anoFormatado}`;

            return dataFormatada;
        };

        /**
         * Retorna se a data especificada é futura em relação a data atual.
         *
         * @param {Date} data
         * @return {Boolean} Retorna {@code true} se a data especificada acontece depois
         * da data atual, {@code false} caso contrário.
         */
        this.isDataFutura = data => {
            const agora = new Date(),
                isAnoFuturo = agora.getFullYear() <= data.getFullYear(),
                isAnoIgual = agora.getFullYear() === data.getFullYear(),
                isMesFuturo = agora.getMonth() <= data.getMonth(),
                isMesIgual = agora.getMonth() === data.getMonth(),
                isDiaFuturo = agora.getDate() < data.getDate();

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