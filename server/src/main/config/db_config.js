(function () {
    "use strict";
    let mongoose = require('mongoose');
    require('events').EventEmitter.prototype._maxListeners = 0;
    const _ = require('../util/util');

    let db = mongoose.connection;

    module.exports = () => {
        let is_test;
        _.each(process.argv, argumento => {
            is_test = is_test || _.includes(_.toLower(argumento), 'test');
        });

        const perfil = is_test ? 'SCORE-TESTDB' : 'SCORE';

        /**
         * Caso não haja uma variável de ambiente informando o endereço do banco de dados,
         * utilizar endereço local.
         */
        const db_string = process.env.MONGODB_ADDRESS || 'mongodb://127.0.0.1:27017/' + perfil; //'mongodb://piton:piton@ds131109.mlab.com:31109/piton';
        if (!db.readyState) {
            const conn = mongoose.connect(db_string);
        }

        db.once('error', console.error.bind(console, 'Something really strange happened...'));
        db.once('open', () => {
            db.opened = true;
            console.log('DB Ready to go! ' + db_string);
        });

        return db;
    };
} ())