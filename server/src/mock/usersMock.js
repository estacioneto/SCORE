(function () {
    'use strict';
    let clone = require('clone');
    let _ = require('../main/util/util');

    /**
     * UserMock lida com os mocks relacionado ao Auth0 usado em nossos testes.
     *
     * @author Estácio Pereira
     */
    let UsersMock = {};

    let validUser = {
        username: 'test@test.email.com',
        password: 'aisimmeupatrao',
        connection: 'Username-Password-Authentication',
        grant_type: 'password',
        scope: 'openid'
    };

    let auth0User = {
        email_verified: false,
        email: "test-email@test.email",
        updated_at: "2017-01-02T17:54:52.857Z",
        name: "test-email@test.email",
        picture: "https://s.gravatar.com/avatar/94d62398e573e6bbe23f9b3926e33be6?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png",
        user_id: "auth0|58264135c8c5c2816298f466",
        nickname: "test-email",
        identities: [
            {
                user_id: "58264135c8c5c2816298f466",
                provider: "auth0",
                connection: "Username-Password-Authentication",
                isSocial: false
            }
        ],
        created_at: "2016-11-11T22:07:49.974Z",
        last_ip: "189.70.43.44",
        last_login: "2017-01-02T17:54:52.857Z",
        logins_count: 99,
        blocked_for: [],
        guardian_enrollments: [],
        app_metadata: {
            permissoes: []
        }
    };

    let token = process.env.SCORE_TEST_TOKEN;

    let email = 'test-email@test.email';

    /**
     * Retorna um usuário valido para o nosso sistema Auth0
     *
     * @returns {Object} Valid user.
     */
    UsersMock.getValidUser = () => clone(validUser);

    /**
     * Retorna um usuário Auth0.
     *
     * @returns {Object} O usuário Auth0.
     */
    UsersMock.getAuth0User = () => {
        let user = clone(auth0User);
        user.email = UsersMock.getNewEmail();
        return user;
    };

    /**
     * Retorna um usuário comum do Auth0.
     *
     * @returns {Object} Usuário com permissões comuns.
     */
    UsersMock.getAuth0UserComum = () => {
        const usuario = UsersMock.getAuth0User();
        usuario.app_metadata.permissoes = [];
        return usuario;
    };

    /**
     * Retorna um usuário admin do Auth0.
     *
     * @returns {Object} Usuário com permissões de admin.
     */
    UsersMock.getAuth0UserAdmin = () => {
        const usuario = UsersMock.getAuth0User();
        usuario.app_metadata.permissoes = [_.ADMIN];
        return usuario;
    };

    /**
     * Retorna um usuário com permissão de reserva do Auth0.
     *
     * @returns {Object} Usuário com permissões de reservas.
     */
    UsersMock.getAuth0UserReserva = () => {
        const usuario = UsersMock.getAuth0User();
        usuario.app_metadata.permissoes = [_.RESERVAS];
        return usuario;
    };

    /**
     * Retorna um novo email.
     *
     * @returns {String} Um email único.
     */
    UsersMock.getNewEmail = () => _.generateNewString(Math.floor(Math.random() * _.RANDOM_STRING_LENGTH)) + 'a@' +
    _.generateNewString(Math.floor(Math.random() * _.RANDOM_STRING_LENGTH)) + '.com';

    /**
     * Retorna um 'real JWT' sem expiração.
     *
     * @returns {String} O 'real JWT' sem expiração.
     */
    UsersMock.getToken = () => token;

    /**
     * Coloca um usuário com permissão comum no cache de usuários, dado o service.
     */
    UsersMock.cacheUsuarioComum = usersService => {
        const usuarioComumMock = UsersMock.getAuth0UserComum();
        cacheUsuario(usersService, usuarioComumMock);
    };

    /**
     * Coloca um usuário com permissão de Admin no cache de usuários, dado o service.
     */
    UsersMock.cacheUsuarioAdmin = usersService => {
        const usuarioAdminMock = UsersMock.getAuth0UserAdmin();
        cacheUsuario(usersService, usuarioAdminMock);
    };

    /**
     * Coloca um usuário com permissão de Reesrvas no cache de usuários, dado o service.
     */
    UsersMock.cacheUsuarioReservas = usersService => {
        const usuarioAdminMock = UsersMock.getAuth0UserReserva();
        cacheUsuario(usersService, usuarioAdminMock);
    };

    /**
     * Coloca um usuário no cache.
     *
     * @param {UsersService} usersService Service de usuários.
     * @param {Object}       usuario      Usuário a ser colocado no cache.
     */
    function cacheUsuario(usersService, usuario) {
        const token = UsersMock.getToken();
        usersService.cacheUser(token, usuario);
    }

    module.exports = UsersMock;
})();
