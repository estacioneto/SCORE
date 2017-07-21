'use strict';

const Local = require('../model/Local'),
    _ = require('../util/util');

export class LocaisService {

    constructor(db_profile = 'SCORE') {
        require('../config/db_config')(db_profile);
    }

}

