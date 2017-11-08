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
        if (err) return console.log(err);
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
     * @param   {String}           accessToken Token de acesso do usuário.
     * @returns {Promise.<Object>} Promise resolvida com o perfil do usuário no Auth0.
     */
    static getProfile(accessToken) {
        return new Promise((resolve, reject) =>
            auth0Authentication.getProfile(accessToken, (err, result) => {
                if (err) return reject(err);
                result = (!_.isObject(result)) ? JSON.parse(result) : result;
                return resolve(result);
            })
        );
    }

    /**
     * Consulta um usuário no Auth0 dado o id do mesmo.
     *
     * @param   {String}           idUsuario Id do usuário.
     * @returns {Promise.<Object>} Promise resolvida com o usuário no Auth0.
     */
    static async getUser(idUsuario) {
        return new Promise((resolve, reject) =>
            auth0Management.getUser({id: idUsuario}, (err, result) => {
                if (err) return reject(err);
                result = (!_.isObject(result)) ? JSON.parse(result) : result;
                return resolve(result);
            })
        );
    }
}

/**
 * Função para inicializar os artefatos do Auth0.
 */
(() => {
    iniciarAuth0Autentication();
    iniciarAuth0Management();
})();
