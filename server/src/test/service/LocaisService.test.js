'use strict';

require('../testSetup');

import {LocaisService} from '../../main/service/LocaisService';

/**
 * Teste do Service de Locais.
 *
 * @author Estácio Pereira.
 */
describe('LocaisServiceTest', () => {
    let locaisService; // Instância

    before(done => {
        locaisService = new LocaisService(TEST_DB);
        done();
    });

    describe('constructor deve', () => {
        it('ser de boas', () => {
            expect(1).to.be.eql(1);
        });
    });

});
