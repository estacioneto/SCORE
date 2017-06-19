(function(){
    'use strict';

    var express = require('express');

    var routesMiddlware = require('./server/src/main/middleware/routesMiddleware');
    var bootstrapMiddleware = require('./server/src/main/middleware/bootstrapMiddleware'); 

    // Cria um objeto Application do Express
    var app = express();

    routesMiddlware.set(app);

    bootstrapMiddleware.set(app);

})();