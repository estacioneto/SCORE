import _ from '../util/util';
import {AuthService} from './authService';

/**
 * O usersService lida com os detalhes mais complexos detalhes/lógica de usuário. É 
 * responsável por tudo relacionado a caching de usuários e é extremamente útil para identificar
 * o usuário logado.
 *
 * @author Estácio Pereira.
 */
let usersService = {
    cache: {},
    idCache: {}
};

/**
 * Recupera um elemento do cache. Requerido para controlar o elemento mais acessado.
 *
 * @param   {string} cache Nome do cache.
 * @param   {string} key   Chave para o elemento requerido.
 * @returns {String} Valor em cache.
 */
function getFromCache(cache, key) {
    usersService[cache][key].touched = Date.now();
    return usersService[cache][key].value;
}

/**
 * Insere um elemento no cache.
 *
 * @param   {string} cache Nome do cache.
 * @param   {string} key   Chave do elemento requerido.
 * @param   {Object} value Valor para inserir no cache.
 */
function putOnCache(cache, key, value) {
    usersService[cache][key] = {
        value: value,
        touched: Date.now()
    };
}

/**
 * Limpa do cache os elementos que não foram acessados recentemente (60 minutos atrás).
 *
 * @param {string} cache Nome do cache.
 */
function clearCache(cache) {
    _.each(usersService[cache], function (element, key) {
        if (element.touched + _.TEN_MINUTES < Date.now()) delete usersService[cache][key];
    });
}

/**
 * Verifica se o usuário está em cache.
 *
 * @param   {Object}  user O usuário para verificar.
 * @returns {boolean} true se o usuário está em cache, false caso contrário.
 */
usersService.isCached = user => _.some(usersService.cache, {value: JSON.stringify(user)});

/**
 * Adiciona um usuário no cache.
 *
 * @param {String} token O token do usuário.
 * @param {Object} user  O usuário para adicionar em cache.
 */
usersService.cacheUser = (token, user) => {
    if (!_.isEmpty(token) && !_.isEmpty(user)) {
        user = JSON.stringify(user);

        const tokenAntigo = _.findKey(usersService.cache, {value: user});
        if (tokenAntigo) {
            delete usersService.cache[tokenAntigo];
        }
        putOnCache('cache', token, user);
        putOnCache('idCache', user.user_id, JSON.parse(user));
    }
};

usersService.getUserById = (userId, callback) => {
    if (!_.isEmpty(usersService.idCache[userId])) {
        return callback(null, getFromCache('idCache', userId));
    }
    return AuthService.getUserById(userId, (err, result) => {
        if (err) return callback(err, null);
        putOnCache('idCache', userId, result);
        return callback(null, result);
    });
};

/**
 * Recupera o usuário com o token dado, se este existir (erro, caso contrário).
 * Se o usuário está em cache, não precisa requisitar Auth0.
 *
 * @param {String}   accessToken Token de acesso.
 * @param {Function} callback    Funcao callback chamada após a query.
 */
usersService.getUser = (accessToken, callback) => {
    if (usersService.cache[accessToken]) {
        return callback(null, JSON.parse(getFromCache('cache', accessToken)));
    }
    return AuthService.getProfile(accessToken, (err, result) => {
        if (!err) {
            usersService.cacheUser(accessToken, result);
        }
        return callback(err, result);
    });
};

usersService.getLoggedUserTokenByEmail = email => {
    let index = 0;
    let tokens = Object.keys(usersService.cache);
    while (index < tokens.length) {
        let user = JSON.parse(usersService.cache[tokens[index]].value);
        if (user.email === email) return tokens[index];
    }
};

/**
 * Ativa o limpador do cache.
 */
(() => {
    setInterval(() => {
        clearCache('cache');
        clearCache('idCache');
    }, _.TEN_MINUTES);
})();

module.exports = usersService;
