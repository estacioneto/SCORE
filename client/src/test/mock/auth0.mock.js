/**
 * Mock do lock do Auth0. Guarda os dados de funções para asserts.
 *
 * @author Estácio Pereira.
 */
class Auth0Lock {

    constructor() {
        this.constructorArgs = Object.values(arguments);
    }

    on() {
        this.onArgs = Object.values(arguments);
    }

    show() {
    }

    getProfile(idToken, callback) {
        this.getProfileArgs = Object.values(arguments);
        return callback;
    }
}
