/**
 * I think it is not the correct way of storing these variables.
 * The Auth0 credentials should be stored as environment variables.
 */

const AUTH0_CLIENT_ID = 'FXhjEG4sAdI2CzocJV5oGXw10wvkeGkD';
const AUTH0_DOMAIN = 'score-uasc.auth0.com';

const LOCK_CONFIG = {
    auth: {
        redirect: false
    },
    theme: {
        logo: 'img/icons/ufcg-360x388.png',
        primaryColor: "#3F51B5"
    },
    languageDictionary: {
        title: "SCORE - UASC",
        emailInputPlaceholder: 'seu@email.com',
        passwordInputPlaceholder: 'Sua senha',
        welcome: 'Bem vindo, %s!'
    },
    language: 'pt-br',
    autoclose: true,
    additionalSignUpFields: [{
        name: 'nome_completo',
        placeholder: 'Nome Completo',
        icon: 'img/icons/account.png', //https://materialdesignicons.com/
        validator: function (name) {
            return {
                valid: name.length > 0,
                hint: "Não pode ser vazio!" // optional
            };
        }
    }, {
        name: 'numero_telefone',
        placeholder: '(DDD) Número (8 ou 9 dígitos)',
        icon: 'img/icons/phone.png',
        validator: function (number) {
            return {
                valid: new RegExp(/\(\d{2}\) \d{8,9}/).test(number),
                hint: "Número deve seguir padrão: (DDD) Número 8 ou 9 dígitos " // optional
            };
        }
    }]
};