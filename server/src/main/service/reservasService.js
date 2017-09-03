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
        return persisteReserva(reserva).then(reservaPersistida => 
            cadastrarRepeticoes(reservaPersistida, () => callback(null, reservaPersistida))
        ).catch(err => 
            callback(err, null)
        );
    }

    /**
     * Excluir e readiciona as repetições para uma reserva.
     * 
     * @param {Reserva} reserva Reserva a ter as repetições atualizadas.
     * @param {Function} cb Callback executado ao final da operação.
     */
    function readicionarRepeticoes(reserva, cb) {
        return new Promise((resolve, reject) => {
            if (reserva.eventoPai) 
                return reject("Atualização frequência de reserva repetida não implementada.");

            excluirRepeticoes(reserva, (err, resp) => {
                if (err) return reject(err);
                cadastrarRepeticoes(reserva, (err, resp) => {
                    if (err) reject(err);
                    else resolve(resp);
                });
            });
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
        const opcoes = {
            atualizarTodas: novaReserva.atualizarTodas,
            atualizarFuturas: novaReserva.atualizarFuturas,
            atualizarRepeticao: false
        };

        getReservaById(token, idReserva, (err,reserva) => {
           if(err) return callback(err,null);
            opcoes.atualizarRepeticao = !reserva.recorrente && novaReserva.recorrente
                    || reserva.recorrente && !novaReserva.recorrente
                    || reserva.frequencia !== novaReserva.frequencia;
            
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
                
                tratarAtualizacao(reservaAntiga, opcoes).then(reservaAtualizada => 
                    callback(null, reservaAtualizada)
                ).catch(err => 
                    callback(err, null)
                );
            });
        });
    };

    /**
     * Realiza o tratamento da atualização de reserva.
     * Tratamento sobre repetição:
     * - Atualizar todas: atualiza todas as reservas da repetição.
     * - Atualizar futuras: atualiza todas as reservas da repetição futuras à passada.
     * - Atualizar repetição: readiciona as reservas de acordo com a nova frequência de repetição.
     * 
     * @param {Reserva} reserva Reserva a ser atualizada.
     * @param {Object} opts Opções para a atualização da reserva.
     */
    function tratarAtualizacao(reserva, opts) {
        const promisesAtt = [persisteReserva(reserva)];
        
        if (opts.atualizarRepeticao) {
            const promiseAttRepeticao = readicionarRepeticoes(reserva);
            promisesAtt.push(promiseAttRepeticao);
        } else if (opts.atualizarTodas) {
            const promiseAttAll = updateRepeticoes(reserva, true);
            promisesAtt.push(promiseAttAll);
        } else if (opts.atualizarFuturas) {
            const promiseAttFuturas = updateRepeticoes(reserva);
            promisesAtt.push(promiseAttFuturas);
        }

        return Promise.all(promisesAtt).then(data => reserva);
    }

    /**
     * Realiza a atualização nas repetições, onde apenas as repetições futuras
     * a esta são atualizadas se a flag allAll não for passada.
     * 
     * @param {Reserva} reservaAtt Reserva a ter as repetições atualizadas.
     * @param {Boolean} attAll Identificador sobre se deve atualizar todas as reservas da repetição.
     */
    function updateRepeticoes(reservaAtt, attAll = false) {
        const updated = getPropriedadesUpdate(reservaAtt);
        let query = { eventoPai: reservaAtt.eventoPai || reservaAtt._id };

        if (attAll) {
            query = { $or: [query, { _id: reservaAtt.eventoPai }] };
        } else {
            query.dia = { $gt: reservaAtt.dia };
        }

        return new Promise((resolve, reject) => 
            Reserva.update(query, updated, { multi: true }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        );
    }

    /**
     * Recupera um objeto com apenas as propriedades atualizaveis da reserva
     * referentes a uma reserva, utilizado para o update.
     * 
     * @param {Reserva} reserva Reserva a se retirar as propriedades.
     * @return {Object} Objeto com as propriedades da reserva.
     */
    function getPropriedadesUpdate(reserva) {
        const propriedades = ["fimRepeticao", "titulo", "descricao", "inicio", "fim", "tipo", "recorrente", "frequencia"];
        const updated = {};
        propriedades.forEach(prop => updated[prop] = reserva[prop]);
        return updated;
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
     */
    function persisteReserva(reserva) {
        return new Promise((resolve, reject) => {
            reserva.save((err, resultado) => {
                if (err) return reject(err);
                return resolve(resultado.toObject());
            });
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
