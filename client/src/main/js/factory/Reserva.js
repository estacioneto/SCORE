let sequenceReserva = 1;
(() => {
    'use strict';
    /**
     * Factory que representa a entidade de reserva.
     */
    angular.module('reservaModulo').factory('Reserva', ['$http', 'TIPOS_RESERVA', function ($http, TIPOS_RESERVA) {

        const DIA_INDICE = 2, MES_INDICE = 1, ANO_INDICE = 0,
              HORA_INDICE = 0, MINUTO_INDICE = 1;

        const API = "/api/reservas";

        /*
         * Obs: Provavelmente terá que ser adicionado duas funções privadas para criação de
         * uma reserva, uma para quando nós iremos montar e outra para quando receber o evento
         * da diretiva do calendário. Da maneira implementada, serve apenas para quando
         * estamos montando nós mesmos.
         *
         * Todo: Remover id, o qual será gerado pelo mongodb
         */
        function Reserva({_id,
                          localId,
                          autor,
                          titulo,
                          descricao,
                          inicio,
                          fim,
                          dia,
                          tipo,
                          fimRepeticao,
                          frequencia}) {

            obterPropriedades(this, {_id,
                                 localId,
                                 autor,
                                 titulo,
                                 descricao,
                                 inicio,
                                 fim,
                                 dia,
                                 tipo,
                                 fimRepeticao,
                                 frequencia});

            this.dia = new Date(this.dia);
            this.fimRepeticao = new Date(this.fimRepeticao || dia);
            this.frequencia = this.frequencia || 1;
            this.diaSemana = 1;
            this.recorrente = true;
        }

        /**
         * Define todas as propriedades da origem para
         * o destino. Shallow copy.
         * 
         * @param {*} instancia Objeto de destino.
         * @param {*} props Objeto de origem das propriedades.
         */
        function obterPropriedades(instancia, props) {
            Object.assign(instancia, props);
        }

        /**
         * Recupera a reserva original do servidor.
         * @return Promise da requisição.
         */
        Reserva.prototype.carregar = function () {
            return $http.get(`${API}/${this._id}`).then(data => {
                obterPropriedades(this, data.data);
                return data;
            });
        };

        /**
         * Persiste a reserva.
         * @return Promise da requisição.
         */
        Reserva.prototype.salvar = function () {
            if (this._id) {
                return this.atualizar();
            }
            return  $http.post(API, this).then(data => {
                obterPropriedades(this, data.data);
                return data;
            });
        };

        /**
         * Exclui a reserva do servidor.
         * @return Promise da requisição.
         */
        Reserva.prototype.excluir = function () {
            return $http.delete(`${API}/${this._id}`).then(data => {
                delete this.autor;
                delete this.descricao;
                delete this.titulo;
                return data;
            });
        };

        /**
         * Atualiza a requisição no servidor.
         * @return Promise da requisição.
         */
        Reserva.prototype.atualizar = function () {
            return $http.patch(`${API}/${this._id}`, this).then(data => {
                obterPropriedades(this, data.data);
                return data;
            });
        };

        /**
         * Retorna o horário de início e término da reserva formatada.
         *
         * @return {String} Retorna o par de horários de início e término, respectivamente,
         * no formato hh:mm-hh:mm.
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

        /**
         * Atributo necessário para o evento ser fixado no calendário, para caso haja
         * alguma alteração - inclui-se inserção de um novo - o evento não suma após
         * o calendário rendenrizar uma nova view.
         */
        Reserva.prototype.__defineGetter__('stick', function () {
            return true;
        });

        /**
         * Getter para a cor de fundo para o evento no calendário.
         * Deve ser RGB ou HEX.
         */
        Reserva.prototype.__defineGetter__('backgroundColor', function () {
            return (TIPOS_RESERVA[this.tipo]) ? TIPOS_RESERVA[this.tipo].corRgb : TIPOS_RESERVA["Reunião"].corRgb;
        });

        /**
         * Getter para a cor de borda para o evento no calendário.
         * Deve ser RGB ou HEX.
         */
        Reserva.prototype.__defineGetter__('borderColor', function () {
            return this.backgroundColor;
        });

        /**
         * Getter para a cor do texto para o evento no calendário.
         * Deve ser RGB ou HEX.
         */
        Reserva.prototype.__defineGetter__('textColor', function () {
            return TIPOS_RESERVA[this.tipo].corTexto;
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
         * Recupera o fim da repetição como um Date.
         */
        Reserva.prototype.__defineGetter__('fimRepeticaoDate', function () {
            if (!this.fimRepeticao) {
                return this.start;
            }
            return this.fimRepeticao; //new Date(getAno(this.fimRepeticao), getMes(this.fimRepeticao), getDia(this.fimRepeticao));
        });

        Reserva.prototype.__defineSetter__('fimRepeticaoDate', function (data) {
            // const ano = data.getFullYear();
            // let mes = `0${data.getMonth() + 1}`;
            // mes = mes.substring(mes.length - 2);
            // let dia = `0${data.getDate()}`;
            // dia = dia.substring(dia.length - 2);
            // this.fimRepeticao = `${ano}-${mes}-${dia}`;
            this.fimRepeticao = data;
        });

        /**
         * Retorna o dia da data especificada.
         *
         * @param {String} data Data, a qual deve seguir o padrão dd-MM-yyyy, a ter o seu
         * dia retornado.
         * @return {String} Dia da data especificada, no formato dd.
         */
        function getDia(data) {
            return data.getDate(); //data.split('-')[DIA_INDICE];
        }

        /**
         * Retorna o mês da data especificada. Sabendo que o construtor de Date utiliza 0
         * para representar Janeiro, 1 para Fevereiro, e assim por diante, temos que
         * decrementar uma unidade do valor do mês.
         *
         * @param {String} data Data, a qual deve seguir o padrão dd-MM-yyyy, a ter o seu
         * mês retornado.
         * @return {String} Mês da data especificada, no formato MM.
         */
        function getMes(data) {
            // let mesString = data.split('-')[MES_INDICE];
            // let mesInt = parseInt(mesString);
            // mesInt = mesInt - 1;
            return data.getMonth(); //mesInt.toString();
        }

        /**
         * Retorna o ano da data especificada.
         *
         * @param {String} data Data, a qual deve seguir o padrão dd-MM-yyyy, a ter o seu
         * ano retornado.
         * @return {String} Ano da data especificada, no formato yyyy.
         */
        function getAno(data) {
            return data.getFullYear(); //data.split('-')[ANO_INDICE];
        }

        /**
         * Retorna a hora do horário especificado.
         *
         * @param {String} horario Horário, o qual deve seguir o padrão hh:mm, a ter sua
         * hora retornada.
         * @return {String} Hora do horário especificado, no formato hh.
         */
        function getHora(horario) {
            return horario.split(':')[HORA_INDICE];
        }

        /**
         * Retorna o minuto do horário especificado.
         *
         * @param {String} horario Horário, o qual deve seguir o padrão hh:mm, a ter seu
         * minuto retornado.
         * @return {String} Minuto do horário especificado, no formato mm.
         */
        function getMinuto(horario) {
            return horario.split(':')[MINUTO_INDICE];
        }

        Reserva.prototype.constructor = Reserva;

        return Reserva;
    }]);
})();