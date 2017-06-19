(function () {
    'use strict';

    let cors = require('cors'),
        path = require('path'),
        express = require('express'),
        fs = require('fs');

    let bootstrapMiddleware = {};

    let main_path = '/src/main';
    let dist_path = '/dist';
    let root_path = '/../../../..';
    let client_path = root_path + '/client';
    let server_port = process.env.PORT || 8080;
    /**
     * Inicia a aplicação
     *
     * @param {Object} app - Application do Express
     */
    bootstrapMiddleware.set = app => {
        app.set('port', server_port);
        app.set('address', process.env.ADDRESS || '192.168.1.7');
        app.use(cors());
    
        let filesPath = __dirname + client_path + main_path;
        if (fs.existsSync(path.resolve(__dirname + client_path + dist_path + '/index.html'))) {
            filesPath = path.resolve(__dirname + client_path + dist_path);
        }
        app.use('/js', express.static(path.resolve(filesPath + '/js')));
        app.use('/css', express.static(path.resolve(filesPath + '/css')));
        app.use('/vendor', express.static(path.resolve(__dirname + client_path + '/vendor')));
        app.use('/fonts', express.static(path.resolve(__dirname + client_path + main_path + '/fonts')));
        app.use('/view', express.static(path.resolve(__dirname + client_path + main_path + '/view')));
        app.use('/config', express.static(path.resolve(__dirname + client_path + main_path + '/config')));
        app.use('/resources', express.static(path.resolve(__dirname + client_path + '/resources')));
        app.use('/img', express.static(path.resolve(__dirname + root_path + '/img')));

        app.get('/', (req, res) => {
            res.sendFile(path.resolve(filesPath + '/index.html'));
        });

        app.post('/', (req, res) => {     
            res.sendFile(path.resolve(filesPath + '/index.html'));
        });

        app.listener = app.listen(server_port, () => {
            console.log('Foi realizado o deploy do client em http://' + app.listener.address().address + ':' + app.listener.address().port);
        });
        // TODO: adicionar um logger
    };

    module.exports = bootstrapMiddleware;
})();
