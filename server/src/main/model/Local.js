(() => {
    'use strict';
    const mongoose = require('mongoose');
    const _ = require('../util/util');

    let Schema = mongoose.Schema;

    /**
     * Schema do Local.
     *
     * @author Estácio Pereira.
     */
    let localSchema = new Schema({
        nome: {
            type: String,
            required: [true, _.CONSTANTES_LOCAL.ERRO_VALIDACAO_NOME]
        },
        bloco: {
            type: String,
            required: [true, _.CONSTANTES_LOCAL.ERRO_VALIDACAO_BLOCO]
        },
        imagens: [{
            conteudo: {type: Buffer},
            tipo: {type: String}
        }], // TODO: Funciona? @author Estácio Pereira, 29/06/2017
        equipamentos: [
            {
                nome: {
                    type: String,
                    required: [true, _.CONSTANTES_LOCAL.ERRO_VALIDACAO_DESCRICAO_EQUIPAMENTO]
                },
                quantidade: {
                    type: Number,
                    required: [true, _.CONSTANTES_LOCAL.ERRO_VALIDACAO_QUANTIDADE_EQUIPAMENTO]
                }
            }
        ],
        capacidade: {
            type: Number,
            required: [true, _.CONSTANTES_LOCAL.ERRO_VALIDACAO_CAPACIDADE]
        },
        funcionamento: {
            type: String,
            required: [true, _.CONSTANTES_LOCAL.ERRO_VALIDACAO_FUNCIONAMENTO]
        },
        observacoes: {
            type: String
        },
        termoDeCondicoes: {
            type: String
        }
    });

    /**
     * Middleware para lidar com pre-save.
     */
    localSchema.pre('save', function (next) {
        // http://stackoverflow.com/questions/7327296/how-do-i-extract-the-created-date-out-of-a-mongo-objectid
        this.createDate = this._id.getTimestamp().getTime();
        this.editDate = Date.now();
        next();
    });

    localSchema.post('save', (err, doc, next) => {
        if (err.name === 'ValidationError') {
            _.handleValidationError(err, next);
        }
        return next(err);
    });

    // http://mongoosejs.com/docs/validation.html
    // Construir validação em cima do que o Mongoose já providencia

    module.exports = mongoose.model('Local', localSchema);
})();
