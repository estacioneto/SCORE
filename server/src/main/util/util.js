/**
 * Sim, adiciona features interessantes do lodash e usa como módulo 'util'.
 */
let _ = require('lodash');
const DIA_INDICE = 0, MES_INDICE = 1, ANO_INDICE = 2,
    HORA_INDICE = 0, MINUTO_INDICE = 1;

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
_.RESERVAS = 'reservas';
_.ACCESS_TOKEN = 'access_token';
_.ERRO_USUARIO_SEM_PERMISSAO = 'Usuário não tem permissão ao recurso.';

/**
 * Dado dois objetos (o target deve ser um objeto mangoose),
 * soft copia as propriedades de um objeto para outro.
 *
 * @param {Mongoose.Model} toObject   Objeto mongoose que terá novas propriedades
 * @param {Object}         fromObject Objeto para ter as propriedades copiadas
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
 * Pesquisa um objeto comparando esse objetos por id.
 *
 * @param {Array}  arr            Array de objetos.
 * @param {Object} mongooseObject Objeto a ser pesquisado.
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
 * Dada a requisição, esta função retorna o token de autorização presente nos headers.
 *
 * @param   {Object} req A requisição.
 * @returns {string} O token dos headers.
 */
_.getToken = req => req.header('access_token') || _.getAuthorizationToken(req);

/**
 * Retorna o token presente na propriedade de autorização do header.
 *
 * @param   {Object} req O request.
 * @returns {String} O token de autorização.
 */
_.getAuthorizationToken = (req) => {
    let authHeader = req.header('Authorization');
    return authHeader.substring(authHeader.indexOf(' ')).trim();
};

/**
 * Gera uma nova string (com probabilidade de repetição muito pequena) dado o tamanho.
 *
 * @param   {Number} size O tamanho da String aleatória.
 * @returns {string} A string aleatória com o tamanho dado
 */
_.generateNewString = size => {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < size; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

/**
 * Lida com o erro de validação do mangoose.
 *
 * @param   {Object}   err  Objeto de erro mongoose.
 * @param   {Function} next Função callback para redirecionar para a próxima função.
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

/**
 * Retorna o dia da data especificada.
 *
 * @param {String} data Data, a qual deve seguir o padrão dd-MM-yyyy, a ter o seu
 * dia retornado.
 * @return {String} Dia da data especificada, no formato dd.
 */
_.getDia = data => {
    return data.split('-')[DIA_INDICE];
};

/**
 * Retorna o mês da data especificada. Sabendo que o construtor de Date utiliza 0
 * para representar Janeiro, 1 para Fevereiro, e assim por diante, temos que
 * decrementar uma unidade do valor do mês.
 *
 * @param {String} data Data, a qual deve seguir o padrão dd-MM-yyyy, a ter o seu
 * mês retornado.
 * @return {String} Mês da data especificada, no formato MM.
 */
_.getMes = data => {
    let mesString = data.split('-')[MES_INDICE];
    let mesInt = parseInt(mesString);
    mesInt = mesInt - 1;
    return mesInt.toString();
};

/**
 * Retorna o ano da data especificada.
 *
 * @param {String} data Data, a qual deve seguir o padrão dd-MM-yyyy, a ter o seu
 * ano retornado.
 * @return {String} Ano da data especificada, no formato yyyy.
 */
_.getAno = data => {
    return data.split('-')[ANO_INDICE];
};

/**
 * Retorna a hora do horário especificado.
 *
 * OBS: Sobre a verificação do isDate: Não remover, pois ao
 * entrar em modo de edição o modal de reserva transforma
 * as horas de início e fim em Date quebrando todas as funções
 * aqui que usavam essa variáveis. Levei só 3 horas pra descobrir. {Lucas}
 *
 * @param {String|Date} horario Horário, o qual deve seguir o padrão hh:mm, a ter sua
 * hora retornada.
 * @return {String} Hora do horário especificado, no formato hh.
 */
_.getHora = horario => {
    if(_ .isDate(horario)){
        return horario.getHours();
    }
    return horario.split(':')[HORA_INDICE];
};

/**
 * Retorna o minuto do horário especificado.
 *
 * @param {String|Date} horario Horário, o qual deve seguir o padrão hh:mm, a ter seu
 * minuto retornado.
 * @return {String} Minuto do horário especificado, no formato mm.
 */
_.getMinuto = horario => {
    if(_ .isDate(horario)){
        return horario.getMinutes();
    }
    return horario.split(':')[MINUTO_INDICE];
};

/**
 * Retorna um objeto Date dadas duas strings contendo data e horario no formato especificado.
 *
 * @param {String} data String contendo a data desejada para o objeto Date no formato dd-MM-yyyy
 * @param {String} horario String contendo o horario desejado para o Date() no formato hh:mm
 * @returns {Date} Objeto Date() criado com os parâmetros especificados.
 */
_.getData = (data, horario) => {
    return new Date(_.getAno(data), _.getMes(data), _.getDia(data),
        _.getHora(horario), _.getMinuto(horario));
};

_.ONE_HOUR = 3600000;
_.TEN_MINUTES = _.ONE_HOUR / 60;

module.exports = _;
