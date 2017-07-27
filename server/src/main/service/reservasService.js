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
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>");
            console.log(user.user_metadata);
            console.log(user);
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>");
            reserva.emailAutor = user.email;
            reserva.userId = user.user_id;
            reserva.autor = user.user_metadata.nome_completo;
            validarHorario(reserva, err => {
                if (err) return callback(err, null)
                return persisteReserva(new Reserva(reserva), callback);
            });
        });
    };

    /**
     * Realiza as validações relacionadas ao horário da reserva.
     * Verifica se o horário da reserva intercepta algum outro
     * para o mesmo dia.
     * Valida se o intervalo de horas é positivo.
     * 
     * TODO: Se esse método crescer, criar um validador. @author Eric Breno
     * 
     * @param {Reserva} reserva Reserva a ser validada.
     * @param {Function} cb Callback a ser invocado com resultado. Se algum
     *                      dado estiver incorreto, o callback é invocado com
     *                      a mensagem de erro.
     */
    function validarHorario(reserva, cb) {
        const intervaloNegativo = reserva.inicio >= reserva.fim;
        if (intervaloNegativo) return cb("Intervalo de horários inválido.");

        Reserva.findByDay(reserva.dia, (err, reservas) => {
            if(err) return cb(err);
            for (let i in reservas) {
                const r = reservas[i];
                if (r._id.toString() === reserva._id) {
                    continue;
                }
                if (hasChoqueHorario(r, reserva)) {
                    return cb("Horário ocupado.");
                }
            };
            return cb(null);
        });
    }

    /**
     * Verifica se as duas reservas têm choque de horários.
     * 
     * * Validações da reserva atualizada AT com a reserva já salva BD:
     * 1- Intervalo de AT tem início de BD.
     *         BD            AT
     *  * 01:00-02:00 <> 00:30-01:30
     *  * 01:00-02:00 <> 00:30-02:30
     * 
     * 2- Intervalo de AT tem fim de BD.
     *         BD            AT
     *  * 01:00-02:00 <> 01:30-02:30
     *  * 01:00-02:00 <> 00:30-02:30
     * 
     * 3- AT está contida ou tem mesmo intervalo de BD.
     *         BD            AT
     *  * 00:00-01:00 <> 00:30-00:50
     *  * 00:00-01:00 <> 00:00-00:50
     *  * 00:00-01:00 <> 00:30-01:00
     * 
     * 4- BD está contida ou tem mesmo intervalo de AT.
     *         BD            AT
     *  * 01:00-02:00 <> 00:30-02:30
     *  * 01:00-02:00 <> 01:00-02:30
     *  * 01:00-02:00 <> 00:30-02:00
     * 
     * @param {Reserva} reserva1
     * @param {Reserva} reserva2 
     * @return {Boolean} True caso haja choque de horário entre as reservas.
     */
    function hasChoqueHorario(reserva1, reserva2) {
        const inicio1 = reserva1.inicio;
        const fim1 = reserva1.fim;
        const inicio2 = reserva2.inicio;
        const fim2 = reserva2.fim;

        const caso1 = inicio1 <  inicio2 && fim1 >  inicio2;
        const caso2 = inicio1 <  fim2    && fim1 >  fim2;
        const caso3 = inicio1 >= inicio2 && fim1 <= fim2;
        const caso4 = inicio1 <= inicio2 && fim1 >= fim2;
        return caso1 || caso2 || caso3 || caso4;
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
            validarHorario(novaReserva, err => {
                if (err) return callback(err, null)

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
