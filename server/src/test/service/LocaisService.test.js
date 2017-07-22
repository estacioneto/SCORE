require('../testSetup');

import _ from '../../main/util/util';
import {LocaisService} from '../../main/service/LocaisService';
import {LocaisMock} from '../../mock/LocaisMock';

import mongoose from 'mongoose';

/**
 * Teste do Service de Locais.
 *
 * @author Estácio Pereira.
 */
describe('LocaisServiceTest', () => {
    let locaisService; // Instância do service

    before(done => {
        locaisService = new LocaisService(TEST_DB);
        done();
    });

    describe('salvarLocal deve', () => {
        it('não salvar um local nulo', () =>
            locaisService.salvarLocal(null)
                .then(
                    info => assert.fail('Deveria ter rejeitado a promise.'),
                    err => {
                        console.log(err);
                        expect(err).to.be.ok;
                    })
        );

        it('salvar um local corretamente', () => {
            const mockLocal = LocaisMock.getLocal();

            expect(mockLocal.nome).to.not.be.undefined;
            expect(mockLocal.bloco).to.not.be.undefined;
            expect(mockLocal.capacidade).to.not.be.undefined;
            expect(mockLocal.funcionamento).to.not.be.undefined;
            expect(mockLocal.observacoes).to.be.undefined;
            expect(mockLocal.termoDeCondicoes).to.be.undefined;

            return locaisService.salvarLocal(mockLocal)
                .catch(err => assert.fail('Deveria ter salvado corretamente.', err))
                .then(local => {
                    expect(local._id).to.be.ok;
                    expect(local.nome).to.be.eql(mockLocal.nome);
                    expect(local.bloco).to.be.eql(mockLocal.bloco);
                    expect(local.capacidade).to.be.eql(mockLocal.capacidade);
                    expect(local.funcionamento).to.be.eql(mockLocal.funcionamento);
                });
        });
    });

    describe('consultarLocalPorId deve', () => {
        it('consultar um local que foi persistido corretamente', () => {
            const mockLocal = LocaisMock.getLocal();
            return locaisService.salvarLocal(mockLocal)
                .catch(err => assert.fail('Deveria ter salvado corretamente.', err))
                .then(localPersistido => {
                    expect(localPersistido._id).to.be.ok;
                    return locaisService.consultarLocalPorId(localPersistido._id)
                        .catch(err => assert.fail('Deveria ter consultado o local corretamente.', err))
                        .then(localConsultado => {
                            expect(localConsultado._id).to.be.ok;
                            expect(_.isMongooseIdEqual(localConsultado._id, localPersistido._id)).to.be.true;
                            expect(JSON.stringify(localConsultado)).to.be.eql(JSON.stringify(localPersistido));
                        });
                });
        });

        it('rejeitar promise ao consultar um local com id inexistente', () => {
            return locaisService.consultarLocalPorId(mongoose.Types.ObjectId())
                .then(
                    info => assert.fail('Deveria ter rejeitado a promise de consulta.', info),
                    err => {
                        expect(err.status).to.be.eql(_.NOT_FOUND);
                        expect(err.mensagem).to.be.eql('Não existe local com o id especificado.');
                    });
        });
    });

    describe.skip('atualizarLocal deve', () => {
        it('não atualizar o local caso alguma propriedade obrigatória tenha sido removida', () => {
            const mockLocal = LocaisMock.getLocal();
            return locaisService.salvarLocal(mockLocal)
                .catch(err => assert.fail('Deveria ter salvado corretamente.', err))
                .then(localPersistido => {
                    const novoLocal = _.clone(localPersistido);
                    delete novoLocal.nome;
                    return locaisService.atualizarLocal(localPersistido._id, novoLocal)
                        .then(info => assert.fail('Deveria ter rejeitado a atualização', info))
                        .catch(err => {
                            expect(err).to.not.be.ok;
                        });
                });
        });
    });

});
