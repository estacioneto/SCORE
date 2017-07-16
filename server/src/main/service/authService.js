(function () {
    "use strict";

    let _ = require('../util/util'),
        request = require('request');

    /**
     * The AuthService deals with the Auth0 system. So, we can access the user
     * by it's identification token. Cool, right?
     */
    let authService = {};

    /**
     * Gets the user from the authorization service (Auth0).
     *
     * @param {String}   idToken  User's identification token.
     * @param {Function} callback Callback function called after the request.
     */
    authService.getUser = (idToken, callback) => {
        let options = {
            //https://auth0.com/docs/api/authentication#get-token-info
            url: _.scoreAuth0 + _.tokeninfo,
            form: {
                id_token: idToken
            }
        };
        return request.post(options, (err, response, body) => {
            if (err) return callback(err, null);
            if (response.statusCode >= _.BAD_REQUEST) {
                err = err || 'Algo deu errado. Status da requisição: ' + response.statusCode;
                return callback(err, null);
            }
            return callback(err, JSON.parse(body));
        });
    };

    /**
     * Given an user, the function uses the authorization service (Auth0) to login.
     * (It is not that useful today, actually. Just for tests.)
     *
     * @param {Object}   user     User that wants to login.
     * @param {Function} callback Callback function called after the login.
     */
    authService.login = function (user, callback) {
        let optionsLogin = {
            url: _.auth0 + _.loginEndpoint,
            form: user
        };

        return request.post(optionsLogin, (err, response, body) => {
            if (response.statusCode >= _.BAD_REQUEST) {
                err = err || 'Algo deu errado. Status da requisição: ' + response.statusCode;
            }
            return callback(err, JSON.parse(body).id_token);
        });
    };

    authService.getUserById = (userId, callback) => {
        let options = {
            url: _.auth0 + '/api/v2/users/' + userId,
            auth: {
                'bearer': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJCZjdiblp0Skg2Q1A2QWxPWGlidVNUd2d1bGlLcnltRCIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiXX19LCJpYXQiOjE0ODUyMTYyNjQsImp0aSI6Ijk0OWI1MzQ0YjRkNjEyOTdlNzUwNDc3YWY1YzZhZGI2In0.oLWNw_mGOUw3pDYd9OgIjms6KnaNMAVCJbe3NyfXtc0'
            }
        };
        return request.get(options, (err, response, body) => {
            if (response.statusCode >= _.BAD_REQUEST) {
                err = err || 'Algo deu errado. Status da requisição: ' + response.statusCode;
                return callback(err, null);
            }
            return callback(err, JSON.parse(body));
        });
    };

    module.exports = authService;
})();
