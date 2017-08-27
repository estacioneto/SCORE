(function () {
    'use strict';

    var mocksModule = angular.module('Mocks', ['userModule', 'localModulo']);

    mocksModule.factory('UsuarioMock', ['Usuario', function (Usuario) {
        this.get = function () {
            return new Usuario({
                clientID: AUTH0_CLIENT_ID,
                created_at: "2016-11-11T22:07:49.974Z",
                email: "test-email@test.email",
                email_verified: false,
                global_client_id: "Bf7bnZtJH6CP6AlOXibuSTwguliKrymD",
                identities: [{
                    connection: "Usuarioname-Password-Authentication",
                    isSocial: false,
                    provider: "auth0",
                    user_id: "58264135c8c5c2816298f466"
                }],
                name: "test-email@test.email",
                nickname: "test-email",
                // picture:"https://s.gravatar.com/avatar/94d62398e573e6bbe23f9b3926e33be6?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png",
                updated_at: "2017-01-01T16:01:10.061Z",
                user_id: "auth0|58264135c8c5c2816298f466",
                user_metadata: {
                    given_name: "Piton",
                    family_name: "Breno"
                }
            });
        };
        return {
            get: this.get
        };
    }]);

    mocksModule.factory('ReservasMock', ['Reserva', function (Reserva) {
        const reservaMock = {
            "autor":"Estácio Neto",
            "titulo":"Reserva",
            "descricao":"Uma descrição qualquer",
            "inicio":"07:30",
            "fim":"20:00",
            "dia":"10-08-2017",
            "tipo":"Palestra",
            "emailAutor":"email@ccc.ufcg.edu.br"
        };

        /**
         * Retorna um mock de reserva.
         * 
         * @param {*} data Dados a serem alterados na reserva.
         */
        function getReserva(data = {}) {
            return new Reserva(Object.assign({}, reservaMock, data));
        }

        return {getReserva};
    }]);

    mocksModule.factory('LocaisMock', ['Local', function (Local) {
        const auditorioSPLab = {nome: 'Auditório SPLab', bloco: 'SPLab'},
            auditorioHattori = {nome: 'Auditório Hattori', bloco: 'CN'},
            salaReunioes = {nome: 'Sala de Reuniões', bloco: 'SPLab'};
        const locais = [auditorioSPLab, auditorioHattori, salaReunioes];

        function getLocais(data = {}) {
            return locais.map(local => new Local(Object.assign({}, local, data)));
        }

        return {getLocais};
    }]);
})();
