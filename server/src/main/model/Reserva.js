(() => {
    'use strict';
    const mongoose = require('mongoose');
    const _ = require('../util/util');

    const Schema = mongoose.Schema;

    const reservaSchema = new Schema({
        autor : {
            type: String,
            required: [true, "A reserva deve ter um responsável."]
        },
        emailAutor: {
            type: String,
            required: [true, 'A reserva deve conter o email do seu autor.']
            //TODO: validar para aceitar apenas emails @ccc, @computacao, @dsc etc.
        },
        userId: {
            type: String,
            required: [true, "A reserva deve possuir um usuário relacionado."]
        },
        localId: {
            type: Schema.Types.ObjectId,
            required: [true, "A reserva deve possuir um local relacionado."]
        },
        titulo : {
            type: String,
            required: [true, "A reserva deve possuir um titulo."]
        },
        descricao : {
            type: String
        },
        inicio : {
            type: String,
            required: [true, "A reserva deve possuir horário de início."],
            validate: {
                validator: function (horaInicio) {
                    return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(horaInicio);
                },
                message: "Hora de inicio da reserva deve estar no formato HH:mm."
            }

        },
        fim : {
            type: String,
            required: [true, "A reserva de possuir horário de fim."],
            validate: {
                validator: function (horaFim) {
                    return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(horaFim);
                },
                message: "Hora de fim da reserva deve estar no formato HH:mm."
            }

        },
        dia : {
            type: Date,
            required: [true, "A reserva deve possuir um dia."]
        },
        tipo : {
            type: String,
            enum: ['Defesa', 'Videoconferência', 'Reunião', 'Assembleia', 'Palestra', 'Outro'],
            required: [true, 'A reserva deve possuir um tipo']
        },
        recorrente: {
            type: Boolean
        },
        fimRepeticao: {
            type: Date,
        },
        diaSemana: {
            type: Number,
            max: [7, "Identificador de dia da semana inválido."],
            min: [1, "Identificador de dia da semana inválido."]
        },
        eventoPai: String
    });

    reservaSchema.static('findByOnlyId', function (id, callback) {
        return this.find({_id: id}, (err, result) => {
            if (err) return callback(err, null);
            return callback(err, _.first(result));
        });
    });

    reservaSchema.static('findById', function (email, id, callback) {
        return this.find({emailAutor: email, _id: id}, (err, result) => {
            if (err) return callback(err, null);
            if (_.isEmpty(result)) return callback('O usuario não é autor de nenhuma reserva com esse id.', null);
            return callback(err, _.first(result));
        });
    });

    reservaSchema.static('findByDayAndLocalId', function (dia, localId, callback) {
        return this.find({dia: dia, localId: localId}, (err, results) => {
            if (err) return callback(err, null);
            return callback(err, results);
        });
    });

    reservaSchema.static('findInDays', function(dias, localId, callback) {
        return this.find({dia: { $in: dias }, localId }, (err, results) => {
            if (err) return callback(err, null);
            return callback(err, results);
        });
    });

    reservaSchema.pre('save', function (next) {
        // http://stackoverflow.com/questions/7327296/how-do-i-extract-the-created-date-out-of-a-mongo-objectid
        this.dataCriacao = this._id.getTimestamp().getTime();
        this.dataEdicao = Date.now();
        this.dia = limparDate(this.dia);
        this.fimRepeticao = limparDate(this.fimRepeticao);
        next();
    });

    /**
     * Limpa um objeto date deixando apenas as informações
     * sobre seu ano, mês e dia.
     * 
     * @param {Date} date Objeto a ser limpo.
     * @return {Date} Date final.
     */
    function limparDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    reservaSchema.post('save', (err, doc, next) => {
        if (err.name === 'ValidationError') {
        _.handleValidationError(err, next);
        }
        return next(err);
    });

    module.exports = mongoose.model('Reserva', reservaSchema);
})();
