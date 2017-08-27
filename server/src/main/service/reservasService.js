import {LocaisService} from "../service/LocaisService";
import {ReservasValidador} from "../validator/reservasValidador";

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
                        return persisteReserva(new Reserva(reserva), (err, resp) => {
                            if (!err) operacoesComRepeticaoCadastro(resp);
                            callback(err, resp);
                        });
                    });
                })
                .catch((err) => callback(err, null));
        });
    };

    function operacoesComRepeticao(reservaOriginal, reserva) {
    }

    /**
     * Assumindo que já foi validado.
     * 
     * @param {*} reserva 
     */
    function operacoesComRepeticaoCadastro(reserva) {
        if (!reserva.recorrente) {
            return "dahell";
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
        console.log(reservasRepetidas.length);
        Reserva.insertMany(reservasRepetidas, (err, docs) => {
            if (err) console.log("erro", err);
            console.log(docs);
        });
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
                persisteReserva(reservaAntiga, callback);
            });
        });
    };

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
                return callback(err, "Deleção efetuada com sucesso.")
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
