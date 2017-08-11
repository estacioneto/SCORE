(function(){
    'use strict';

    var express = require('express');
    const morgan = require('morgan');
    var bodyParser = require('body-parser');

    var routesMiddlware = require('./server/src/main/middleware/routesMiddleware');
    var bootstrapMiddleware = require('./server/src/main/middleware/bootstrapMiddleware'); 

    // Cria um objeto Application do Express
    var app = express();

    app.use(bodyParser.json({limit: '16mb'}));
    app.use(morgan('combined'));

    routesMiddlware.set(app);

    bootstrapMiddleware.set(app);

})();