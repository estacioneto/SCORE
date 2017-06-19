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
    avatar: null,
    theme: {
        logo: 'img/icons/ufcg-360x388.png',
        primaryColor: "#3E4095"
    },
    languageDictionary: {
        title: "SCORE - UASC",
        emailInputPlaceholder: 'seu@email.com',
        passwordInputPlaceholder: 'Sua senha'
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
        placeholder: 'DDD + Número (sem espaço)',
        icon: 'img/icons/phone.png',
        validator: function (number) {
            return {
                valid: new RegExp(/\d{11}/).test(number),
                hint: "Número deve seguir padrão indicado: DDD + Número (Sem espaço entre eles)" // optional
            };
        }
    }, {
        type: "select",
        name: "papel",
        icon: 'img/icons/worker.png',
        placeholder: "Papel na UFCG",
        options: [
            {value: "professor", label: "Professor"},
            {value: "graduando", label: "Aluno de Graduação"},
            {value: "pos-graduando", label: "Aluno de Pós-Graduação"},
            {value: "funcionario", label: "Funcionário"}
        ]
    }]
};