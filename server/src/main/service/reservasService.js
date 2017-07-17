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
        usersService.getUser(token, (err,user) => {
            console.log(user);
            if(err) return callback(err, null);
            Reserva.find({}, function(err, result) {
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
            reserva.emailAutor = user.email;
            reserva.userId = user.user_id;
            //TODO: Validar salvamento p/choque de horarios
            return persisteReserva(new Reserva(reserva), callback);
        });
    };

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
            let reservaAntiga = reserva;//.toObject();
            _.updateModel(reservaAntiga, novaReserva);
            //TODO: Validar update
            persisteReserva(reservaAntiga, callback);
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
            return callback(null, reserva.toObject());
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
