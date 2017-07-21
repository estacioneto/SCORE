'use strict';

export class LocaisService {

    constructor(db_profile = 'SCORE') {
        require('../config/db_config')(db_profile);

        // const Local = require('../model/Local'),
        //     _ = require('../util/util');
    }

}

