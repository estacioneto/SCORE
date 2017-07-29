(function () {
    'use strict';

    /**
     * Oh yes... We add some interesting things to lodash and use it as an util module.
     */
    let _ = require('lodash');

    _.BAD_REQUEST = 400;
    _.NOT_FOUND = 404;
    _.FORBIDDEN = 403;
    _.UNAUTHORIZED = 401;
    _.OK = 200;
    _.CREATED = 201;

    _.FIRST_INDEX = 0;
    _.INVALID_INDEX = -1;

    _.AUTH0 = {
        DOMAIN: "score-uasc.auth0.com",
        SCORE_CLIENT_ID: 'FXhjEG4sAdI2CzocJV5oGXw10wvkeGkD',
        SCORE_CLIENT_SECRET: process.env.SECRET,
        MANAGER_CLIENT_ID: 'EhoRWVDKjVfbEcnX88TVRLJmWP5Tc52n',
        MANAGER_CLIENT_SECRET: process.env.SCORE_MANAGER_SECRET
    };

    _.RANDOM_STRING_LENGTH = 1000;

    _.API_URI = '/api';
    _.CONSTANTES_LOCAL = {
        URI: `${_.API_URI}/locais`,

        ERRO_VALIDACAO_NOME: 'O local deve ter um nome',
        ERRO_VALIDACAO_BLOCO: 'O local deve pertencer a um bloco',
        ERRO_VALIDACAO_DESCRICAO_EQUIPAMENTO: 'O equipamento deve ter uma descrição',
        ERRO_VALIDACAO_QUANTIDADE_EQUIPAMENTO: 'O equipamento deve ter uma quantidade',
        ERRO_VALIDACAO_CAPACIDADE: 'O local deve ter uma capacidade',
        ERRO_VALIDACAO_FUNCIONAMENTO: 'O local deve ter um horário de funcionamento',

        ERRO_LOCAL_NAO_ENCONTRADO: 'Não existe local com o id especificado.'
    };

    _.ADMIN = 'admin';
    _.ERRO_USUARIO_SEM_PERMISSAO = 'Usuário não tem permissão ao recurso.';

    /**
     * Given two objects (the target should be a mongoose object), soft copies the properties from one
     * object to another.
     *
     * @param {Mongoose.Model} toObject   Mongoose object that will have new properties
     * @param {Object}         fromObject Object to have properties copied
     */
    _.updateModel = (toObject, fromObject) => {
        _.each(fromObject, (value, key) => {
            // _id, __v...
            if (_.contains(key, '_')) return;

            // http://stackoverflow.com/questions/15092912/dynamically-updating-a-javascript-object-from-a-string-path
            let keys = key.split('.');
            _.set(toObject, keys, value);
            // https://github.com/Automattic/mongoose/issues/1204
            toObject.markModified(_.first(keys));
        });

        // Remove propriedades que não são mandadas.
        _.each(toObject.toObject(), (value, key) => {
            if (!fromObject[key] && !_.includes(key, '_'))
                toObject[key] = undefined;
        });
    };

    /**
     * Once I tried to use some ways to compare mongoose objects and didn't work. So,
     * in this function, I compare then by the id.
     *
     * @param {Array}  arr            Array to have the object searched.
     * @param {Object} mongooseObject Object to be searched.
     */
    _.containsMongoose = (arr, mongooseObject) =>
        !_.isEmpty(_.filter(arr, obj => JSON.stringify(obj._id) === JSON.stringify(mongooseObject._id)));

    /**
     * Once I tried to use the underscore contains function. Didn't work.
     * This one should do the same thing. Well... Should...
     *
     * @param {Array}  arr    Array to have the object searched.
     * @param {Object} object Object to be searched.
     */
    _.contains = (arr, object) => arr.indexOf(object) !== _.INVALID_INDEX;

    /**
     * Given the request, this function returns the authorization token present on headers.
     *
     * @param   {Object} req The request.
     * @returns {string} The token on headers.
     */
    _.getToken = req => req.header('access_token') || _.getAuthorizationToken(req);

    /**
     * Returns the token present at the authorization header property.
     *
     * @param   {Object} req The request.
     * @returns {String} The authorization token.
     */
    _.getAuthorizationToken = (req) => {
        let authHeader = req.header('Authorization');
        return authHeader.substring(authHeader.indexOf(' ')).trim();
    };

    /**
     * Generates a new String (pretty small probability of same String), given it's size.
     *
     * @param   {Number} size Length of the random String.
     * @returns {string} Random string with the given length
     */
    _.generateNewString = size => {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        for (let i = 0; i < size; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };

    /**
     * Handles the validation error from mongoose.
     *
     * @param   {Object}   err  Mongoose error object.
     * @param   {Function} next Callback function to redirect to the next function.
     */
    _.handleValidationError = (err, next) => {
        let message = 'Erro de validação: ';
        _.each(err.errors, (value, field) => {
            if (message.indexOf(': ') !== message.length - ': '.length)
                message += ', ';
            message += value.message;
        });
        message += '.';
        return next(new Error(message));
    };

    /**
     * Retorna um Objeto para retorno da API dado um Mongoose model.
     *
     * @param   {mongoose.model} mongooseObject
     * @returns {Object} Objeto de retorno.
     */
    _.mongooseToObject = mongooseObject => {
        const objeto = mongooseObject.toObject();
        delete objeto.__v;
        return objeto;
    };

    /**
     * Retorna um objeto com a response em caso do erro {@code Not found (404)}.
     *
     * @param  {String} mensagem Mensagem de erro.
     * @return {{[status] : Number, [mensagem] : String}} Objeto de response com status e mensagem.
     */
    _.notFoundResponse = mensagem => ({status: _.NOT_FOUND, mensagem});

    /**
     * Retorna uma função que vai cuidar da response de erro.
     * Ex.: {@code Promise.catch(_.retornarResponseErro(res))}.
     *
     * @param   {Object}   res Objeto de response do rest.
     * @returns {Function} Função para lidar com a promise rejeitada e rejeitar a response.
     */
    _.retornarResponseErro = res =>
        (err => res.status(err.status || _.BAD_REQUEST).json({
            mensagem: err.message || err.mensagem || err
        }));

    _.ONE_HOUR = 3600000;
    _.TEN_MINUTES = _.ONE_HOUR / 60;

    module.exports = _;
})();
