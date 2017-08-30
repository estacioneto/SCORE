import {LocaisService} from "../service/LocaisService";
import {ReservasValidador} from "../validator/reservasValidador";

/**
 * TODO: refatorar esta parte.
 * 
 * 1- utilizar updates para atualizar as reservas da repeticao de acordo com a reserva
 * pai
 * 2- ao atualizar reserva sozinha, nao remover referencia da reserva pai - para quando
 * atualizar a pai, atualizar todas as filhas
 * 3- ao atualizar uma repeticao junto das proximas, atualizar todas que tem o mesmo idPai
 * e que o dia está a frente do dia da que você está atualizando
 * 4- ao atualizar o intervalo de repetição: apenas remover futuras invalidas
 * ou adicionar futuras inexistentes.
 * 5- ao alterar data de repeticao: readicionar
 */

(function () {
    'use strict';
    let Reserva = require('../model/Reserva'),
        usersService = require('./usersService'),
        _ = require('../util/util');

    let reservasService = {};

    /**
     * Obtém todas as reservas.
     *
     * @param {String}   token    Token de identificação do usuário logado.
     * @param {Function} callback Função chamada após erro ou sucesso na operação.
     */
    reservasService.getReservas = (token, callback) => {
        usersService.getUser(token, (err, user) => {
            if(err) return callback(err, null);
            Reserva.find({}, function(err, result) {
                if (err) return callback(err, null);
                return callback(null, result);
            });
        });
    };

    /**
     * Obtém todas as reservas do local que teve o id especificado.
     *
     * @param {String}   token    Token de identificação do usuário logado.
     * @param {String}   localId  Id do local a ter suas reservas retornadas.
     * @param {Function} callback Função chamada após erro ou sucesso na operação.
     */
    reservasService.getReservasDoLocal = (token, localId, callback) => {
        usersService.getUser(token, (err, user) => {
            if(err) return callback(err, null);
            Reserva.find({localId: localId}, function(err, result) {
                if (err) return callback(err, null);
                return callback(null, result);
            });
        });
    };

    /**
     * Cria uma nova reserva em nosso banco de dados.
     *
     * @param {String}   token    Token de identificação do usuário logado.
     * @param {Object}   reserva  Nova reserva a ser persistida.
     * @param {Function} callback Função chamada após erro ou sucesso na operação.
     */
    reservasService.salvaReserva = (token, reserva, callback) => {
        usersService.getUser(token, (err, user) => {
            if(err) return callback(err, null);
            LocaisService.consultarLocalPorId(reserva.localId)
                .then(() => {
                    reserva.emailAutor = user.email;
                    reserva.userId = user.user_id;
                    reserva.autor = user.user_metadata.nome_completo;
                    ReservasValidador.validarHorario(reserva, err => {
                        if (err) return callback(err, null);
                        return persisteReservaComRepeticoes(new Reserva(reserva), callback);
                    });
                })
                .catch((err) => callback(err, null));
        });
    };

    function persisteReservaComRepeticoes(reserva, callback) {
        return persisteReserva(reserva, (err, reservaPersistida) => {
            if (!err) return cadastrarRepeticoes(reservaPersistida, () => callback(null, reservaPersistida));
            callback(err, reservaPersistida);
        });
    }

    /**
     * Realiza as operações sobre repetição para atualização de reserva.
     * Exclui as repetições e readiciona, caso se necessário.
     * 
     * @param {Reserva} reserva Reserva a ter as repetições atualizadas.
     * @param {Function} cb Callback executado ao final da operação.
     */
    function operacoesComRepeticaoAtualizacao(reserva, cb) {
        excluirRepeticoes(reserva, (err, resp) => {
            if (err) return cb(err, null);
            cadastrarRepeticoes(reserva, cb);
        });
    }

    /**
     * Exclui as repetições de uma reserva.
     * 
     * @param {Reserva} reserva Reserva a ter as repetições excluídas.
     * @param {Function} cb Callback a ser executado quando a operação for concluída.
     */
    function excluirRepeticoes(reserva, cb) {
        Reserva.remove({ eventoPai: reserva._id }, cb);
    }

    /**
     * Cadastra as repetições para uma reserva.
     * 
     * @param {Reserva} reserva Reserva a ter as repetições cadastradas.
     * @param {Function} cb Callback a ser executado quando a operação for concluída.
     */
    function cadastrarRepeticoes(reserva, cb) {
        if (!reserva.recorrente) {
            return cb();
        }
        const dias = ReservasValidador.calcularDiasRepeticao(reserva);
        const reservasRepetidas = [];
        dias.forEach(diaRepeticao => {
            const reservaTemp = new Reserva(reserva);
            reservaTemp.eventoPai = reservaTemp._id;
            reservaTemp._id = undefined;
            reservaTemp.dia = new Date(diaRepeticao);
            reservasRepetidas.push(reservaTemp);
        });
        Reserva.insertMany(reservasRepetidas, cb);
    }

    /**
     * Atualiza as propriedades de uma reserva já
     * existente em nosso banco de dados.
     *
     * @param {String}   token       Token de identificação do usuário logado.
     * @param {String}   idReserva   Id da reserva original.
     * @param {Object}   novaReserva Reserva atualizada a ser persistida.
     * @param {Function} callback    Função chamada após erro ou sucesso na operação.
     */
    reservasService.atualizaReserva = (token, idReserva, novaReserva, callback) => {
        getReservaById(token, idReserva, (err,reserva) => {
           if(err) return callback(err,null);
            let reservaAntiga = reserva;
            // FIXME: Desfazer isso quando passarmos a utilizar
            // patch corretamente. Necessário por a atualização
            // atual assumir que deve deletar propriedades que não
            // foram enviadas do cliente, e estas não são realmente enviadas nunca.
            // @author Eric Breno - 29/07/17
            novaReserva.emailAutor = reservaAntiga.emailAutor;
            novaReserva.userId = reservaAntiga.userId;
            novaReserva.autor = reservaAntiga.autor;

            ReservasValidador.validarHorario(novaReserva, err => {
                if (err) return callback(err, null);
                _.updateModel(reservaAntiga, novaReserva);
                
                if (novaReserva.eventoPai) {
                    const idReservaPai = reservaAntiga.eventoPai;
                    reservaAntiga.eventoPai = null;
                    reservaAntiga.save((err, res) => {
                        atualizarReservaPai(idReservaPai, reservaAntiga.dia, (err, res) => {
                            if (err) return callback(err, null);
                            operacoesComRepeticaoAtualizacao(reservaAntiga, callback);
                        });
                    });
                } else {
                    persisteReserva(reservaAntiga, (err, reservaAtualizada) => {
                        if (!err) return operacoesComRepeticaoAtualizacao(reservaAtualizada, () => callback(err, reservaAtualizada));
                        callback(err, reservaAtualizada);
                    });
                }
            });
        });
    };

    /**
     * Atualiza a reserva paicom o novo dia de fim da repetição.
     * 
     * @param {*} idReservaPai Id da reserva Pai.
     * @param {*} dia Novo dia de fim da repetição.
     * @param {*} cb Callback para ser executado ao finalizar a operação.
     */
    function atualizarReservaPai(idReservaPai, dia, cb) {
        Reserva.findByOnlyId(idReservaPai, (err, reservaPai) => {
            const date = new Date(dia);
            date.setDate(date.getDate() - 1);
            reservaPai.fimRepeticao = date;
            reservaPai.save((err, reservaPaiAtt) => {
                if (err) return cb(err, null);
                operacoesComRepeticaoAtualizacao(reservaPaiAtt, cb);
            });
        });
    }

    /**
     * Obtém uma reserva dado o seu Id.
     *
     * @param {String}   token      Token de identificação do usuário logado.
     * @param {String}   idReserva  Id da reserva desejada.
     * @param {Function} callback   Função chamada após erro ou sucesso na operação.
     */
    reservasService.getReservaById = (token, idReserva, callback) => {
        getReservaById(token, idReserva, (err,reserva) => {
           if(err) callback(err, null);
            return callback(null, (reserva || {}).toObject());
        });
    };

    /**
     * Deleta uma reserva dado o seu Id.
     *
     * @param {String}   token     Token de identificação do usuário logado.
     * @param {String}   idReserva Id da reserva a ser deletada.
     * @param {Function} callback  Função chamada após erro ou sucesso na operação.
     */
    reservasService.deletaReserva = (token, idReserva, callback) => {
        //TODO: Validar deleção
        getReservaById(token, idReserva, (err,reserva) => {
            if(err) return callback(err, null);
            return reserva.remove(err => {
                if(err) return callback(err, null);
                excluirRepeticoes(reserva, (err, res) => callback(err, "Deleção efetuada com sucesso."));
            });
        });
    };

    /**
     * Persiste uma reserva no banco de dados.
     *
     * @param {Object}   reserva  Reserva a ser persistida.
     * @param {Function} callback Função chamada após erro ou sucesso na operação.
     */
    function persisteReserva(reserva, callback) {
        return reserva.save((err, resultado) => {
            if (err) return callback(err, resultado);
            return callback(null, resultado.toObject());
        });
    }

    /**
     * Obtém uma reserva do banco de dados dado o seu Id.
     *
     * @param {String}   token     Token de identificação do usuário logado.
     * @param {String}   idReserva Id da reserva desejada.
     * @param {Function} callback  Função chamada após erro ou sucesso na operação.
     */
    function getReservaById(token, idReserva, callback){
        return usersService.getUser(token, (err,user) => {
            if(err) return callback(err, null);
            return Reserva.findById(user.email, idReserva, callback);
        });
    }

    module.exports = (db_profile) => {
        const dbName = 'SCORE';
        db_profile = db_profile || dbName;
        let db = require('../config/db_config')(db_profile);
        return reservasService;
    }
})();
