import {AuthenticationClient, ManagementClient} from 'auth0';

import _ from '../util/util';

let auth0Authentication, auth0Management;

/**
 * Inicia o objeto para lidar com a Authentication API.
 */
function iniciarAuth0Autentication() {
    auth0Authentication = new AuthenticationClient({
        domain: _.AUTH0.DOMAIN,
        clientId: _.AUTH0.MANAGER_CLIENT_ID,
        clientSecret: _.AUTH0.MANAGER_CLIENT_SECRET
    });
}

/**
 * Inicia o objeto para lidar com a Management API.
 */
function iniciarAuth0Management() {
    const opcoesManagement = {
        audience: `https://${_.AUTH0.DOMAIN}/api/v2/`,
        scope: 'read:users read:user_idp_tokens'
    };

    auth0Authentication.clientCredentialsGrant(opcoesManagement, (err, response) => {
        if (err) console.log(err);
        auth0Management = new ManagementClient({
            token: response.access_token,
            domain: _.AUTH0.DOMAIN
        });
    });
}

/**
 * Classe responsável por cuidar de detalhes relacionados à autenticação.
 *
 * @class
 */
export class AuthService {

    /**
     * Retorna um usuário dado o token de acesso do mesmo.
     *
     * @param {String}   accessToken Token de acesso do usuário.
     * @param {Function} callback    Função de callback chamada após a requisição do perfil do usuário.
     */
    static getProfile(accessToken, callback) {
        return auth0Authentication.getProfile(accessToken, (err, result) => {
            if (err) return callback(err);
            result = (!_.isObject(result)) ? JSON.parse(result) : result;
            return callback(err, result);
        });
    }

    /**
     * Consulta um usuário no Auth0 dado o id do mesmo.
     *
     * @param {String}   idUsuario   Id do usuário.
     * @param {Function} callback Função de callback executada após a consulta do usuário.
     */
    static getUserById(idUsuario, callback) {
        return auth0Management.getUser({id: idUsuario}, (err, result) => {
            if (err) return callback(err);
            result = (!_.isObject(result)) ? JSON.parse(result) : result;
            return callback(err, result);
        });
    }
}

/**
 * Função para inicializar os artefatos do Auth0.
 */
(() => {
    iniciarAuth0Autentication();
    iniciarAuth0Management();
})();
