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
            reserva.autor = user.user_metadata.nome_completo;
            validarHorario(reserva, temChoque => {
                if (temChoque)
                    return callback("Horário ocupado.", null)
                return persisteReserva(new Reserva(reserva), callback);
            });
        });
    };

    function validarHorario(reserva, cb) {
        Reserva.findByDay(reserva.dia, (err, reservas) => {
            if(err) return cb(true);
            const inicio = reserva.inicio;
            const fim = reserva.fim;
            for (let i in reservas) {
                const r = reservas[i];
                if (r.fim > inicio && r.inicio < inicio
                    || r.inicio < fim && r.fim > fim
                    || r.inicio > inicio && r.fim < fim
                    || r.inicio < inicio && r.fim > fim
                    || r.inicio === inicio || r.fim === fim
                    || r.inicio < inicio && r.fim > inicio) {
                    console.log("tem choque de horario");
                    return cb(true);
                }
            };
            return cb(false);
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
            let reservaAntiga = reserva;//.toObject();
            validarHorario(novaReserva, temChoque => {
                if (temChoque)
                    return callback("Horário ocupado.", null)

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