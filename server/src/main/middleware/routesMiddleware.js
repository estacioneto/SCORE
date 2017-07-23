import LocaisRouter from '../router/LocaisRouter';

const bodyParser = require('body-parser'),
    jwt = require('express-jwt'),
    cors = require('cors'),
    http = require("http");

const usersRouter = require('../router/usersRouter');
const reservasRouter = require('../router/reservasRouter');
const routesMiddleware = {};

const authCheck = jwt({
    secret: process.env.SECRET,
    audience: 'FXhjEG4sAdI2CzocJV5oGXw10wvkeGkD'
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

module.exports = routesMiddleware;