import LocaisRouter from '../router/LocaisRouter';
import _ from '../util/util';

const bodyParser = require('body-parser'),
    jwt = require('express-jwt'),
    cors = require('cors'),
    http = require("http");

const usersRouter = require('../router/usersRouter');
const reservasRouter = require('../router/reservasRouter');
const routesMiddleware = {};

export const authCheck = jwt({
    secret: _.AUTH0.SCORE_CLIENT_SECRET,
    audience: _.AUTH0.SCORE_CLIENT_ID
});

/**
 * Configura a aplicação para as rotas de requisições
 *
 * @param {Object} app - Objeto que encapsula a aplicação Express
 */
routesMiddleware.set = app => {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.authMiddleware = authCheck;

    app.use('/api/users', app.authMiddleware, usersRouter);
    app.use('/api/reservas', app.authMiddleware, reservasRouter);
    app.use('/api/locais', app.authMiddleware, LocaisRouter);
};

export {routesMiddleware};