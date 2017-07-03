let sequenceReserva = 1;
(() => {
    'use strict';
    /**
     * Factory que representa a entidade de reserva.
     */
    angular.module('agendamentoModulo', []).factory('Reserva', ['$http', '$q', function ($http, $q) {

        const COR_DEFAULT = '', COR_TEXTO_DEFAULT = '',
              DIA_INDICE = 0, MES_INDICE = 1, ANO_INDICE = 2,
              HORA_INDICE = 0, MINUTO_INDICE = 1;

        /*
         * Obs: Provavelmente terá que ser adicionado duas funções privadas para criação de
         * uma reserva, uma para quando nós iremos montar e outra para quando receber o evento
         * da diretiva do calendário. Da maneira implementada, serve apenas para quando
         * estamos montando nós mesmos.
         */
        function Reserva(data) {
            if (!data) {
                this.id = sequenceReserva++;
                return;
            }
            this.id = data.id || sequenceReserva++;
            this.autor = data.autor;
            this.titulo = data.titulo;
            this.descricao = data.descricao;
            this.inicio = data.inicio;
            this.fim = data.fim;
            this.dia = data.dia;
            this.cor = data.cor || COR_DEFAULT;
            this.corTexto = data.corTexto || COR_TEXTO_DEFAULT;
        }

        /**
         * Recupera a reserva original do servidor.
         * @return Promise da requisição.
         */
        Reserva.prototype.carregar = function () {
            return $q.when({});
        };

        /**
         * Persiste a reserva.
         * @return Promise da requisição.
         */
        Reserva.prototype.salvar = function () {
            return $q.when(this);
        };

        /**
         * Exclui a reserva do servidor.
         * @return Promise da requisição.
         */
        Reserva.prototype.excluir = function () {
            delete this.autor;
            delete this.descricao;
            return this.salvar();
        };

        /**
         * Atualiza a requisição no servidor.
         * @return Promise da requisição.
         */
        Reserva.prototype.atualizar = function () {
            return $q.when({});
        };

        /**
         * Retorna o horário de início e término da reserva formatada, no formato
         * hh:mm-hh:mm
         */
        Reserva.prototype.getHoraFormatada = function() {
            return `${this.inicio}-${this.fim}`;
        };

        Reserva.prototype.__defineGetter__('author', function () {
            return this.autor;
        });

        Reserva.prototype.__defineGetter__('title', function () {
            return this.titulo;
        });

        Reserva.prototype.__defineGetter__('description', function () {
            return this.descricao;
        });

        Reserva.prototype.__defineGetter__('color', function () {
            return this.cor;
        });

        Reserva.prototype.__defineGetter__('textColor', function () {
            return this.corTexto;
        });

        /**
         * Retorna o início da reserva, contento dia e horário, em Date.
         */
        Reserva.prototype.__defineGetter__('start', function () {
            return new Date(getAno(this.dia), getMes(this.dia), getDia(this.dia),
                getHora(this.inicio), getMinuto(this.inicio));
        });

        /**
         * Retorna o término da reserva, contento dia e horário, em Date.
         */
        Reserva.prototype.__defineGetter__('end', function () {
            return new Date(getAno(this.dia), getMes(this.dia), getDia(this.dia),
                getHora(this.fim), getMinuto(this.fim));
        });

        /**
         * Retorna o dia da data especificada, a qual deve seguir o padrão dd-MM-yyyy.
         */
        function getDia(data) {
            return data.split('-')[DIA_INDICE];
        }

        /**
         * Retorna o mês da data especificada, a qual deve seguir o padrão dd-MM-yyyy.
         * Sabendo que o construtor de Date utiliza 0 para representar Janeiro, 1 para
         * Fevereiro, e assim por diante, temos que decrementar uma unidade do valor
         * do mês.
         */
        function getMes(data) {
            let mesString = data.split('-')[MES_INDICE];
            let mesInt = parseInt(mesString);
            mesInt = mesInt - 1;
            return mesInt.toString();
        }

        /**
         * Retorna o ano da data especificada, a qual deve seguir o padrão dd-MM-yyyy.
         */
        function getAno(data) {
            return data.split('-')[ANO_INDICE];
        }

        /**
         * Retorna a hora do horário especificado, o qual deve seguir o padrão hh:mm.
         */
        function getHora(horario) {
            return horario.split(':')[HORA_INDICE];
        }

        /**
         * Retorna o minuto do horário especificado, o qual deve seguir o padrão hh:mm.
         */
        function getMinuto(horario) {
            return horario.split(':')[MINUTO_INDICE];
        }

        Reserva.prototype.constructor = Reserva;

        return Reserva;
    }]);
})();