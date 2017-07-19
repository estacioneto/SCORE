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
            required: [true, "A reserva deve possuir o usuário relacionado."]
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
            type: String,
            required: [true, "A reserva deve possuir um dia."],
            validate: {
                validator: function (dataDia) {
                    //https://stackoverflow.com/questions/8937408/regular-expression-for-date-format-dd-mm-yyyy-in-javascript
                    return /(^(((0[1-9]|1[0-9]|2[0-8])[-](0[1-9]|1[012]))|((29|30|31)[-](0[13578]|1[02]))|((29|30)[-](0[4,6,9]|11)))[-](19|[2-9][0-9])\d\d$)|(^29[-]02[-](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/.test(dataDia);
                },
                message: "Dia da reserva deve estar no formato dd-MM-yyyy."
            }
        },
        cor : {
            type: String
        },
        corTexto: {
            type: String
        }
    });

    reservaSchema.static('findById', function (email, id, callback) {
        return this.find({emailAutor: email, _id: id}, (err, result) => {
            if (err) return callback(err, null);
            if (_.isEmpty(result)) return callback('O usuario não é autor de nenhuma reserva com esse id.', null);
            return callback(err, _.first(result));
        });
    });

    reservaSchema.static('findByDay', function (dia, callback) {
        return this.find({dia: dia}, (err, results) => {
            if (err) return callback(err, null);
            return callback(err, results);
        });
    });

    reservaSchema.pre('save', function (next) {
        // http://stackoverflow.com/questions/7327296/how-do-i-extract-the-created-date-out-of-a-mongo-objectid
        this.dataCriacao = this._id.getTimestamp().getTime();
        this.dataEdicao = Date.now();
        next();
    });

    reservaSchema.post('save', (err, doc, next) => {
        if (err.name === 'ValidationError') {
        _.handleValidationError(err, next);
        }
        return next(err);
    });

    module.exports = mongoose.model('Reserva', reservaSchema);
})();
