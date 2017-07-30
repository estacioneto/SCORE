require('../testSetup');

import express from 'express';
import mongoose from 'mongoose';

import _ from '../../main/util/util';
import routesMiddleware from '../../main/middleware/routesMiddleware';
import {LocaisMock} from '../../mock/LocaisMock';

import UsersService from '../../main/service/usersService';
import UsersMock from '../../mock/usersMock';

describe('LocaisRouterTest', () => {

    const app = express();
    routesMiddleware.set(app);

    let usuarioComumMock, usuarioAdminMock, token;

    /**
     * Coloca um usuário comum no cache de usuários.
     */
    function cacheUsuarioComum() {
        usuarioComumMock = UsersMock.getAuth0UserComum();
        token = UsersMock.getToken();
        UsersService.cacheUser(token, usuarioComumMock);
    }

    /**
     * Coloca um usuário com permissão de Admin no cache de usuários.
     */
    function cacheUsuarioAdmin() {
        usuarioAdminMock = UsersMock.getAuth0UserAdmin();
        token = UsersMock.getToken();
        UsersService.cacheUser(token, usuarioAdminMock);
    }

    /**
     * Retorna a requisição desejada em /locais/:idLocal
     *
     * @param {String} metodoHttp     Método http do endpoint a ser testado.
     * @param {String} [idLocal = ''] Id do local a ser realizado GET. Se não passado, retorna listagem.
     */
    function requisicaoLocais(metodoHttp, idLocal = '') {
        return request(app)[_.toLower(metodoHttp)](`${_.CONSTANTES_LOCAL.URI}/${idLocal}`)
            .set('Authorization', `Bearer ${token}`)
            .set('access_token', token);
    }

    /**
     * Testa um endpoint para que o mesmo tenha resposta Forbidden (403).
     * Função auxiliar para aumentar o reúso de código.
     *
     * @param {String}   metodoHttp Método http do endpoint a ser testado.
     * @param {String}   uri        URI do endpoint.
     * @param {Object}   reqBody    Objeto a ser enviado.
     * @param {Function} done       Função chamada quando o teste acabar.
     */
    function testeEndPointForbidden({metodoHttp, uri, reqBody = {}, done}) {
        cacheUsuarioComum();
        request(app)[_.toLower(metodoHttp)](uri)
            .set('Authorization', `Bearer ${token}`)
            .set('access_token', token)
            .send(reqBody)
            .expect(_.OK).end((err, res) => {

            expect(err).to.not.be.ok;

            const erro = res.body;
            expect(erro.mensagem).to.be.eql(_.ERRO_USUARIO_SEM_PERMISSAO);
            done();
        });
    }

    /**
     * Testa um endpoint para que o mesmo tenha resposta Not Found (404).
     * Função auxiliar para aumentar o reúso de código.
     *
     * @param {String}   metodoHttp Método http do endpoint a ser testado.
     * @param {String}   idLocal    Id do local.
     * @param {Object}   reqBody    Objeto a ser enviado.
     * @param {Function} done       Função chamada quando o teste acabar.
     */
    function testeEndPointNotFound({metodoHttp, idLocal = mongoose.Types.ObjectId(), reqBody = {}, done}) {
        requisicaoLocais(metodoHttp, idLocal)
            .send(reqBody)
            .expect(_.NOT_FOUND).end((err, res) => {

            expect(err).to.not.be.ok;

            const erro = res.body;
            expect(erro.mensagem).to.be.eql(_.CONSTANTES_LOCAL.ERRO_LOCAL_NAO_ENCONTRADO);
            done();
        });
    }

    beforeEach(() => {
        cacheUsuarioAdmin();
    });

    describe('GET /api/locais deve', () => {
        it('retornar um array de Locais', done => {
            requisicaoLocais('GET').expect(_.OK).end((err, res) => {
                expect(err).to.not.be.ok;

                const locais = res.body;
                expect(_.isArray(locais)).to.be.true;
                done();
            });
        });

        it('retornar um array com todos os locais cadastrados', done => {
            const localMock = LocaisMock.getLocal();
            requisicaoLocais('POST').send(localMock)
                .expect(_.CREATED).end((err, res) => {

                expect(err).to.not.be.ok;
                const localCadastrado = res.body;

                requisicaoLocais('GET').expect(_.OK).end((err, res) => {

                    expect(err).to.not.be.ok;

                    const locais = res.body;
                    expect(_.isArray(locais)).to.be.true;
                    expect(_.some(locais, localCadastrado)).to.be.true;
                    done();
                });
            });
        });
    });

    describe('POST /api/locais deve', () => {
        it('retornar 403 (Forbidden) se o usuário não possuir role admin', done => {
            const metodoHttp = 'POST',
                uri = _.CONSTANTES_LOCAL.URI,
                reqBody = LocaisMock.getLocal();
            testeEndPointForbidden({metodoHttp, uri, reqBody, done});
        });

        it('retornar mensagem de erro caso haja o mesmo no cadastro', done => {
            const localMock = LocaisMock.getLocal();
            delete localMock.nome;

            requisicaoLocais('POST').send(localMock)
                .expect(_.BAD_REQUEST).end((err, res) => {

                expect(err).to.not.be.ok;

                const erro = res.body;
                expect(erro.mensagem).to.be.eql(`Erro de validação: ${_.CONSTANTES_LOCAL.ERRO_VALIDACAO_NOME}.`);
                done();
            });
        });

        it('cadastrar corretamente o local e retornar a entidade persistida', done => {
            const localMock = LocaisMock.getLocal();

            requisicaoLocais('POST').send(localMock)
                .expect(_.CREATED).end((err, res) => {

                expect(err).to.not.be.ok;

                const local = res.body;
                expect(local._id).to.be.ok;
                expect(_.isObject(local)).to.be.true;
                done();
            });
        });
    });

    describe('GET /api/locais/:id deve', () => {
        it('retornar o erro corretamente caso o local com o id informado não exista', done => {
            const metodoHttp = 'GET';
            testeEndPointNotFound({metodoHttp, done});
        });

        it('retornar o local dado o id do mesmo', done => {
            const localMock = LocaisMock.getLocal();

            requisicaoLocais('POST').send(localMock)
                .expect(_.CREATED).end((err, res) => {

                expect(err).to.not.be.ok;
                const localCadastrado = res.body;

                requisicaoLocais('GET', localCadastrado._id).expect(_.OK).end((err, res) => {

                    expect(err).to.not.be.ok;

                    const localConsultado = res.body;
                    expect(localConsultado).to.be.eql(localCadastrado);
                    done();
                });
            });
        });
    });

    describe('DELETE /api/locais/:id deve', () => {
        it('retornar 403 (Forbidden) se o usuário não possuir role admin', done => {
            const metodoHttp = 'DELETE',
                uri = `${_.CONSTANTES_LOCAL.URI}/${mongoose.Types.ObjectId()}`,
                reqBody = LocaisMock.getLocal();
            testeEndPointForbidden({metodoHttp, uri, reqBody, done});
        });

        it('retornar o erro corretamente caso o local com o id informado não exista', done => {
            const metodoHttp = 'DELETE';
            testeEndPointNotFound({metodoHttp, done});
        });

        it('retornar o local removido e remover o mesmo corretamente', done => {
            const localMock = LocaisMock.getLocal();

            // Cadastrar Local
            requisicaoLocais('POST').send(localMock)
                .expect(_.CREATED).end((err, res) => {

                expect(err).to.not.be.ok;
                const localCadastrado = res.body;

                // Deletar local
                requisicaoLocais('DELETE', localCadastrado._id).expect(_.OK).end((err, res) => {

                    expect(err).to.not.be.ok;

                    const localRemovido = res.body;
                    expect(localRemovido).to.be.eql(localCadastrado);

                    // Consulta novamente o local.
                    testeEndPointNotFound({metodoHttp: 'GET', done});
                });
            });
        });
    });

    describe('PUT /api/locais/:id', () => {
        let localCadastrado;

        beforeEach(done => {
            const localMock = LocaisMock.getLocal();
            requisicaoLocais('POST').send(localMock)
                .expect(_.CREATED).end((err, res) => {

                expect(err).to.not.be.ok;
                localCadastrado = res.body;
                done()
            });
        });

        it('retornar 403 (Forbidden) se o usuário não possuir role admin', done => {
            const metodoHttp = 'PUT',
                uri = `${_.CONSTANTES_LOCAL.URI}/${mongoose.Types.ObjectId()}`,
                reqBody = LocaisMock.getLocal();
            testeEndPointForbidden({metodoHttp, uri, reqBody, done});
        });

        it('retornar corretamente o erro caso haja', done => {
            const novoLocal = _.clone(localCadastrado);
            delete novoLocal.bloco;
            requisicaoLocais('PUT', localCadastrado._id).send(novoLocal)
                .expect(_.BAD_REQUEST).end((err, res) => {

                expect(err).to.not.be.ok;
                const erro = res.body;
                expect(erro.mensagem).to.be.eql(`Erro de validação: ${_.CONSTANTES_LOCAL.ERRO_VALIDACAO_BLOCO}.`);
                done();
            });
        });

        it('atualizar o local e retornar o local atualizado', done => {
            const novoLocal = _.clone(localCadastrado);
            novoLocal.bloco = 'LCC3';
            requisicaoLocais('PUT', localCadastrado._id).send(novoLocal)
                .expect(_.OK).end((err, res) => {

                expect(err).to.not.be.ok;
                const localAtualizado = res.body;
                expect(localAtualizado).to.be.eql(novoLocal);
                done();
            });
        });
    });
});
