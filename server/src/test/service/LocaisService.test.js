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
        /**
         * Cria um Mock de String para o conteúdo.
         * O mock vai retornar no método substrig um início de string válido
         * para ser utilizado no validador.
         * O método split vai retornar apenas um objeto com a propriedade length
         * com tamanho maior que o máximo (16 MB).
         * 
         * @param {String} tipo Tipo do arquivo;
         */
        function gerarConteudoMaiorLimite(tipo) {
            let conteudo = `${tipo};base64,asdasdasdasdasdasdasdasddassasdasda`;
            let tamMaiorLimite = 16*1000*1005;
            return { 
                substring: () => conteudo, 
                split: () => { 
                    return {  length: tamMaiorLimite }; 
                } 
            };
        }

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

        it('não salvar um local com imagem de tipo inválido', () => {
            const mockLocal = LocaisMock.getLocal();

            const imagemInvalida = {conteudo: 'data:file/pdf;base64,yEhsacSk09S86h2bA...'};
            mockLocal.imagens.push(imagemInvalida);
            return LocaisService.cadastrarLocal(mockLocal)
                .then(local => assert.fail('Não deveria salvar imagem com tipo inválido.'))
                .catch(err => {
                    expect(err).to.exist;
                    expect(err).to.be.equal("Tipo de imagem não suportado.");
                });
        });

        it('não salvar um local com imagem de tamanho maior que 16MB e tipo inválido', () => {
            const mockLocal = LocaisMock.getLocal();
            let conteudo = gerarConteudoMaiorLimite('file/pdf');
            const imagemInvalida = { conteudo };
            mockLocal.imagens.push(imagemInvalida);
            return LocaisService.cadastrarLocal(mockLocal)
                .then(local => assert.fail('Não deveria salvar imagem com tipo e tamanho inválido.'))
                .catch(err => {
                    expect(err).to.exist;
                    expect(err).to.be.equal("O tamanho máximo suportado é 16MB. Tipo de imagem não suportado.");
                });
        });

        it('não salvar um local com imagem de tamanho maior que 16MB', () => {
            const mockLocal = LocaisMock.getLocal();
            let conteudo = gerarConteudoMaiorLimite('image/png');
            const imagemInvalida = { conteudo };
            mockLocal.imagens.push(imagemInvalida);
            return LocaisService.cadastrarLocal(mockLocal)
                .then(local => assert.fail('Não deveria salvar imagem com tamanho inválido.'))
                .catch(err => {
                    expect(err).to.exist;
                    expect(err).to.be.equal("O tamanho máximo suportado é 16MB. ");
                });
        });

        it(' salvar um local com imagem de tipo válido jpeg', () => {
            const mockLocal = LocaisMock.getLocal();

            const imagemValida = {conteudo: 'data:image/jpeg;base64,yEhsacSk09S86h2bA...'};
            mockLocal.imagens.push(imagemValida);
            return LocaisService.cadastrarLocal(mockLocal)
                .then(local => {
                    expect(local.imagens).to.have.length(1);
                })
                .catch(err => assert.fail('Deveria salvar imagem com tipo válido.'));
        });

        it(' salvar um local com imagem de tipo válido bitmap', () => {
            const mockLocal = LocaisMock.getLocal();

            const imagemValida = {conteudo: 'data:image/bitmap;base64,yEhsacSk09S86h2bA...'};
            mockLocal.imagens.push(imagemValida);
            return LocaisService.cadastrarLocal(mockLocal)
                .then(local => {
                    expect(local.imagens).to.have.length(1);
                })
                .catch(err => assert.fail('Deveria salvar imagem com tipo válido.'));
        });

        it(' salvar um local com imagem de tipo válido png', () => {
            const mockLocal = LocaisMock.getLocal();

            const imagemValida = {conteudo: 'data:image/png;base64,yEhsacSk09S86h2bA...'};
            mockLocal.imagens.push(imagemValida);
            return LocaisService.cadastrarLocal(mockLocal)
                .then(local => {
                    expect(local.imagens).to.have.length(1);
                })
                .catch(err => assert.fail('Deveria salvar imagem com tipo válido.'));
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
                            expect(localConsultado._id).to.be.eql(localPersistido._id);
                            expect(localConsultado).to.be.eql(localPersistido);
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
                    expect(localAtualizado._id).to.be.eql(localPersistido._id);
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
