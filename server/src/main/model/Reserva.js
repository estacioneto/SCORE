(() => {
    'use strict';
    const mongoose = require('mongoose');
    const _ = require('../util/util');

    const Schema = mongoose.Schema;

    const criarValidacaoData = nomeProp => {
        return {
            validator: function (dataDia) {
                //https://stackoverflow.com/questions/8937408/regular-expression-for-date-format-dd-mm-yyyy-in-javascript
                return /(^(((0[1-9]|1[0-9]|2[0-8])[-](0[1-9]|1[012]))|((29|30|31)[-](0[13578]|1[02]))|((29|30)[-](0[4,6,9]|11)))[-](19|[2-9][0-9])\d\d$)|(^29[-]02[-](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/.test(dataDia);
            },
            message: `${nomeProp} deve estar no formato dd-MM-yyyy.`
        }
    }

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
            type: String,
            required: [true, "A reserva deve possuir um dia."],
            validate: criarValidacaoData("Dia da reserva")
        },
        tipo : {
            type: String,
            enum: ['Defesa', 'Videoconferência', 'Reunião', 'Assembleia', 'Palestra', 'Outro'],
            required: [true, 'A reserva deve possuir um tipo']
        },
        repeticao: {
            inicio: {
                type: String,
                required: [true, 'Repetição deve ter uma data de início.'],
                validate: criarValidacaoData("Dia de início para repetição")
            },
            fim: {
                type: String,
                required: [true, 'Repetição deve ter uma data de fim.'],
                validate: criarValidacaoData("Dia de fim para repetição")
            },
            frequencia: {
                type: Number,
                required: [true, 'Repetição deve ter a frequência de repetição para o evento.']
            }
        }
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
