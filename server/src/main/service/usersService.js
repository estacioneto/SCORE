import _ from '../util/util';
import {AuthService} from './authService';

let _cache = {};
const _idCache = {};

/**
 * Recupera um elemento do cache. Requerido para controlar o elemento mais acessado.
 *
 * @param   {Object} cache Cache a ter elemento recuperado.
 * @param   {string} chave Chave para o elemento requerido.
 * @returns {String} Valor em cache.
 */
function _getFromCache(cache, chave) {
    cache[chave].touched = Date.now();
    return cache[chave].value;
}

/**
 * Insere um elemento no cache.
 *
 * @param   {Object} cache Cache.
 * @param   {string} chave Chave do elemento requerido.
 * @param   {Object} valor Valor para inserir no cache.
 */
function _cachePut(cache, chave, valor) {
    cache[chave] = {
        value: valor,
        touched: Date.now()
    }
}

/**
 * Limpa do cache os elementos que não foram acessados recentemente (60 minutos atrás).
 *
 * @param {Object} cache Cache.
 */
function _limparCache(cache) {
    _.each(cache, function (element, key) {
        if (element.touched + _.TEN_MINUTES < Date.now()) delete cache[key];
    });
}

/**
 * O usersService lida com detalhes/lógica de usuário mais complexas. É responsável
 * por tudo relacionado a caching de usuários e é extremamente útil
 * para identificar o usuário logado.
 *
 * @class
 * @author Estácio Pereira.
 */
export class UsersService {

    /**
     * Verifica se o usuário está em cache.
     *
     * @param   {Object}  usuario O usuário para verificar.
     * @returns {boolean} true se o usuário está em cache, false caso contrário.
     */
    static isCached(usuario) {
        return _.some(_cache, {value: JSON.stringify(usuario)});
    }

    /**
     * Adiciona um usuário no cache.
     *
     * @param {String} token   O token do usuário.
     * @param {Object} usuario O usuário para adicionar em cache.
     */
    static cachePut(token, usuario) {
        if (!_.isEmpty(token) && !_.isEmpty(usuario)) {
            const usuarioString = JSON.stringify(usuario);
            const tokenAntigo = _.findKey(_cache, {value: usuarioString});

            if (tokenAntigo) {
                delete _cache[tokenAntigo];
            }
            _cachePut(_cache, token, usuarioString);
            _cachePut(_idCache, usuario.user_id, usuario);
        }
    }

    static async getUserById(idUsuario) {
        if (!_.isEmpty(_idCache[idUsuario])) {
            return _getFromCache(_idCache, idUsuario);
        }

        const usuario = await AuthService.getUser(idUsuario);
        _cachePut(_idCache, idUsuario, usuario);
        return usuario;
    }

    /**
     * Recupera o usuário com o token dado, se este existir (erro, caso contrário).
     * Se o usuário está em cache, não precisa requisitar Auth0.
     *
     * @param {String}   accessToken Token de acesso.
     */
    static async getUser(accessToken) {
        if (_cache[accessToken]) {
            return JSON.parse(_getFromCache(_cache, accessToken));
        }
        const usuario = await AuthService.getProfile(accessToken);
        UserService.cachePut(accessToken, usuario);

        return usuario;
    }

    static get _cache() {
        return _cache;
    }

    static set _cache(newCache) {
        _cache = newCache;
    }
}

/**
 * Ativa o limpador do cache.
 */
(() => {
    setInterval(() => {
        _limparCache(_cache);
        _limparCache(__idCache);
    }, _.TEN_MINUTES);
})();
