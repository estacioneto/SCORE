let sequenceReserva = 1;
(() => {
    'use strict';
    /**
     * Factory que representa a entidade de reserva.
     */
    angular.module('reservaModulo').factory('Reserva', ['$http', 'TIPOS_RESERVA', 'RESERVA_PASSADA', function ($http, TIPOS_RESERVA, RESERVA_PASSADA) {

        const DIA_INDICE = 0, MES_INDICE = 1, ANO_INDICE = 2,
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
                          tipo}) {

            obterPropriedades(this, {_id,
                                 localId,
                                 autor,
                                 titulo,
                                 descricao,
                                 inicio,
                                 fim,
                                 dia,
                                 tipo});
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

        /**
         * Retorna True caso a reserva seja de uma data já passada.
         *
         * OBS: Ter cuidado ao lidar com a variavel fim, pois esta
         * pode vir a ser undefined. (Na criação de reserva, por exemplo). {Lucas}
         * @returns {boolean}
         */
        Reserva.prototype.ehReservaPassada = function () {
            return (this.fim)? this.end < Date.now() : false;
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
         * Getter para o tema utilizado no modal de
         * criação/edição de reservas.
         */
        Reserva.prototype.__defineGetter__('tema', function () {
            if(this.ehReservaPassada()){
                return RESERVA_PASSADA.mdTheme;
            }
            return (TIPOS_RESERVA[this.tipo]) ? TIPOS_RESERVA[this.tipo].mdTheme || 'default' : 'default';
        });

        /**
         * Getter para a cor de fundo para o evento no calendário.
         * Deve ser RGB ou HEX.
         */
        Reserva.prototype.__defineGetter__('backgroundColor', function () {
            if(this.ehReservaPassada()){
                return RESERVA_PASSADA.corRgb;
            }
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
            if(this.ehReservaPassada()) return RESERVA_PASSADA.corTexto ;
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
         * Retorna o dia da data especificada.
         *
         * @param {String} data Data, a qual deve seguir o padrão dd-MM-yyyy, a ter o seu
         * dia retornado.
         * @return {String} Dia da data especificada, no formato dd.
         */
        function getDia(data) {
            return data.split('-')[DIA_INDICE];
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
            let mesString = data.split('-')[MES_INDICE];
            let mesInt = parseInt(mesString);
            mesInt = mesInt - 1;
            return mesInt.toString();
        }

        /**
         * Retorna o ano da data especificada.
         *
         * @param {String} data Data, a qual deve seguir o padrão dd-MM-yyyy, a ter o seu
         * ano retornado.
         * @return {String} Ano da data especificada, no formato yyyy.
         */
        function getAno(data) {
            return data.split('-')[ANO_INDICE];
        }

        /**
         * Retorna a hora do horário especificado.
         *
         * OBS: Sobre a verificação do isDate: Não remover, pois ao
         * entrar em modo de edição o modal de reserva transforma
         * as horas de início e fim em Date quebrando todas as funções
         * aqui que usavam essa variáveis. Levei só 3 horas pra descobrir. {Lucas}
         *
         * @param {String|Date} horario Horário, o qual deve seguir o padrão hh:mm, a ter sua
         * hora retornada.
         * @return {String} Hora do horário especificado, no formato hh.
         */
        function getHora(horario) {
            if(_ .isDate(horario)){
                return horario.getHours();
            }
            return horario.split(':')[HORA_INDICE];
        }

        /**
         * Retorna o minuto do horário especificado.
         *
         * @param {String|Date} horario Horário, o qual deve seguir o padrão hh:mm, a ter seu
         * minuto retornado.
         * @return {String} Minuto do horário especificado, no formato mm.
         */
        function getMinuto(horario) {
            if(_ .isDate(horario)){
                return horario.getMinutes();
            }
            return horario.split(':')[MINUTO_INDICE];
        }

        Reserva.prototype.constructor = Reserva;

        return Reserva;
    }]);
})();