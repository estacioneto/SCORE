(function () {
    'use strict';
    var express = require('express'),
        cors = require('cors'),
        path = require('path');

    var app = express();


    app.set('port', server_port);
    app.set('address', process.env.ADDRESS || 'localhost');
    app.use(cors());

    app.use('/node_modules', express.static(path.resolve(__dirname + root_path + '/node_modules')));
    
    app.use('/js', express.static(path.resolve(__dirname + main_path + 'js')));
    app.use('/css', express.static(path.resolve(__dirname + main_path + 'css')));
    app.use('/view', express.static(path.resolve(__dirname + main_path + 'view')));
    app.use('/config', express.static(path.resolve(__dirname + main_path + 'config')));
    app.use('/resources', express.static(path.resolve(__dirname + root_path + 'client/resources')));

    app.get('/', function(req, res) {
        res.sendFile(path.resolve(__dirname + main_path + 'index.html'));
    });

    app.listener = app.listen(app.get('port'), app.get('address'), function () {
        console.log('Foi realizado o deploy do client em http://' + app.listener.address().address + ':' + app.listener.address().port);
    });

    module.exports = app;
})();