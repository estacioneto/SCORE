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

    describe('cadastrarLocal deve', () => {
        it('não salvar um local nulo', () => {
            return LocaisService.cadastrarLocal(null)
                .then(
                    info => assert.fail('Deveria ter rejeitado a promise.'),
                    err => {
                        expect(err).to.be.ok;
                    });
        });

        it('salvar um local corretamente', () => {
            const mockLocal = LocaisMock.getLocal();

            expect(mockLocal.nome).to.not.be.undefined;
            expect(mockLocal.bloco).to.not.be.undefined;
            expect(mockLocal.capacidade).to.not.be.undefined;
            expect(mockLocal.funcionamento).to.not.be.undefined;
            expect(mockLocal.observacoes).to.be.undefined;
            expect(mockLocal.termoDeCondicoes).to.be.undefined;

            return LocaisService.cadastrarLocal(mockLocal)
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

    describe('consultarLocais deve', () => {
        it('retornar uma lista contendo todos os locais inseridos', () => {
            const mockLocal = LocaisMock.getLocal();
            return LocaisService.cadastrarLocal(mockLocal)
                .catch(err => assert.fail('Deveria ter salvado corretamente.', err))
                .then(localPersistido => {
                    expect(localPersistido._id).to.be.ok;
                    return LocaisService.consultarLocais()
                        .catch(err => assert.fail('Deveria ter consultado os locais corretamente.', err))
                        .then(locaisConsultados => {
                            expect(locaisConsultados).to.not.be.empty;
                            expect(_.isArray(locaisConsultados)).to.be.true;
                            expect(_.some(locaisConsultados, localPersistido)).to.be.true;
                        });
                });
        });
    });

    describe('consultarLocalPorId deve', () => {
        it('consultar um local que foi persistido corretamente', () => {
            const mockLocal = LocaisMock.getLocal();
            return LocaisService.cadastrarLocal(mockLocal)
                .catch(err => assert.fail('Deveria ter salvado corretamente.', err))
                .then(localPersistido => {
                    expect(localPersistido._id).to.be.ok;
                    return LocaisService.consultarLocalPorId(localPersistido._id)
                        .catch(err => assert.fail('Deveria ter consultado o local corretamente.', err))
                        .then(localConsultado => {
                            expect(localConsultado._id).to.be.ok;
                            expect(_.isMongooseIdEqual(localConsultado._id, localPersistido._id)).to.be.true;
                            expect(JSON.stringify(localConsultado)).to.be.eql(JSON.stringify(localPersistido));
                        });
                });
        });

        it('rejeitar promise ao consultar um local com id inexistente', () => {
            return LocaisService.consultarLocalPorId(mongoose.Types.ObjectId())
                .then(
                    info => assert.fail('Deveria ter rejeitado a promise de consulta.', info),
                    err => {
                        expect(err.status).to.be.eql(_.NOT_FOUND);
                        expect(err.mensagem).to.be.eql(_.CONSTANTES_LOCAL.ERRO_LOCAL_NAO_ENCONTRADO);
                    });
        });
    });

    describe('atualizarLocal deve', () => {
        let localPersistido;

        beforeEach(() => {
            const mockLocal = LocaisMock.getLocal();
            return LocaisService.cadastrarLocal(mockLocal).then(local => {
                localPersistido = local;
            });
        });

        it('não atualizar o local caso alguma propriedade obrigatória tenha sido removida', () => {
            const novoLocal = _.clone(localPersistido);

            // Utilizando o delete, ignoramos o campo.
            novoLocal.nome = undefined;
            return LocaisService.atualizarLocal(localPersistido._id, novoLocal)
                .then(
                    info => assert.fail('Deveria ter rejeitado a atualização', info),
                    err => {
                        expect(err).to.be.ok;
                        expect(err).to.be.eql(`Erro de validação: ${_.CONSTANTES_LOCAL.ERRO_VALIDACAO_NOME}.`);
                    });
        });

        it('atualizar o local corretamente caso nenhuma propriedade obrigatória tenha sido violada', () => {
            const novoLocal = _.clone(localPersistido);

            novoLocal.observacoes = 'O auditório é muito legal.';
            return LocaisService.atualizarLocal(localPersistido._id, novoLocal)
                .then(localAtualizado => {
                    expect(_.isMongooseIdEqual(localAtualizado._id, localPersistido._id)).to.be.true;
                    expect(localAtualizado).to.be.eql(novoLocal);
                });
        });
    });

    describe('deletarLocal deve', () => {
        let localPersistido;

        beforeEach(() => {
            const mockLocal = LocaisMock.getLocal();
            return LocaisService.cadastrarLocal(mockLocal).then(local => {
                localPersistido = local;
            });
        });

        it('retornar promise rejeitada em caso de inexistência do local', () => {
            return LocaisService.deletarLocal(mongoose.Types.ObjectId())
                .then(
                    info => assert.fail('Deveria ter rejeitado a remoção', info),
                    err => {
                        expect(err.status).to.be.eql(_.NOT_FOUND);
                        expect(err.mensagem).to.be.eql(_.CONSTANTES_LOCAL.ERRO_LOCAL_NAO_ENCONTRADO);
                    });
        });

        it('deletar corretamente um local', () => {
            return LocaisService.deletarLocal(localPersistido._id)
                .catch(err => assert.fail('Deveria ter deletado corretamente.', err))
                .then(localRemovido => {
                    expect(localRemovido).to.be.eql(localPersistido);

                    return LocaisService.consultarLocalPorId(localRemovido._id)
                        .catch(err => {
                            expect(err.status).to.be.eql(_.NOT_FOUND);
                            expect(err.mensagem).to.be.eql(_.CONSTANTES_LOCAL.ERRO_LOCAL_NAO_ENCONTRADO);
                        });
                });
        });
    });
});
