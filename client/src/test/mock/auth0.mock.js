/**
 * Mock do lock do Auth0. Guarda os dados de funções para asserts.
 *
 * @author Estácio Pereira.
 */
class Auth0Lock {

    constructor() {
        this._constructorArgs = Object.values(arguments);
    }

    on() {
        this._onArgs = Object.values(arguments);
    }

    show() {
    }

    getProfile(idToken, callback) {
        this._getProfileArgs = Object.values(arguments);
        return callback;
    }
}
