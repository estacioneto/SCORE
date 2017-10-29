import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import {routesMiddleware} from './server/src/main/middleware/routesMiddleware';
import bootstrapMiddleware from './server/src/main/middleware/bootstrapMiddleware';

// Cria um objeto Application do Express
const app = express();

app.use(bodyParser.json({
    limit: '30mb'
}));

app.use(morgan('combined'));

routesMiddleware.set(app);

bootstrapMiddleware.set(app);