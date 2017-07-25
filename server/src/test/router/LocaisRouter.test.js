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
            .send(reqBody)
            .expect(_.FORBIDDEN).end((err, res) => {

            expect(err).to.not.be.ok;

            const erro = res.body;
            expect(erro.mensagem).to.be.eql(_.ERRO_USUARIO_SEM_PERMISSAO);
            done();
        });
    }

    beforeEach(() => {
        cacheUsuarioAdmin();
    });

    describe('GET /api/locais deve', () => {
        it('retornar um array de Locais', done => {
            request(app).get(_.CONSTANTES_LOCAL.URI)
                .set('Authorization', `Bearer ${token}`)
                .expect(_.OK).end((err, res) => {

                expect(err).to.not.be.ok;

                const locais = res.body;
                expect(_.isArray(locais)).to.be.true;
                done();
            });
        });

        it('retornar um array com todos os locais cadastrados', done => {
            const localMock = LocaisMock.getLocal();
            request(app).post(_.CONSTANTES_LOCAL.URI)
                .set('Authorization', `Bearer ${token}`)
                .send(localMock)
                .expect(_.CREATED).end((err, res) => {

                expect(err).to.not.be.ok;
                const localCadastrado = res.body;

                request(app).get(_.CONSTANTES_LOCAL.URI)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(_.OK).end((err, res) => {

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

            request(app).post(_.CONSTANTES_LOCAL.URI)
                .set('Authorization', `Bearer ${token}`)
                .send(localMock)
                .expect(_.BAD_REQUEST).end((err, res) => {

                expect(err).to.not.be.ok;

                const erro = res.body;
                expect(erro.mensagem).to.be.eql(`Erro de validação: ${_.CONSTANTES_LOCAL.ERRO_VALIDACAO_NOME}.`);
                done();
            });
        });

        it('cadastrar corretamente o local e retornar a entidade persistida', done => {
            const localMock = LocaisMock.getLocal();

            request(app).post(_.CONSTANTES_LOCAL.URI)
                .set('Authorization', `Bearer ${token}`)
                .send(localMock)
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
            request(app).get(`${_.CONSTANTES_LOCAL.URI}/${mongoose.Types.ObjectId()}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(_.NOT_FOUND).end((err, res) => {

                expect(err).to.not.be.ok;

                const resposta = res.body;
                expect(resposta.mensagem).to.be.eql(_.CONSTANTES_LOCAL.ERRO_LOCAL_NAO_ENCONTRADO);
                done();
            });
        });

        it('retornar o local dado o id do mesmo', done => {
            const localMock = LocaisMock.getLocal();

            request(app).post(_.CONSTANTES_LOCAL.URI)
                .set('Authorization', `Bearer ${token}`)
                .send(localMock)
                .expect(_.CREATED).end((err, res) => {

                expect(err).to.not.be.ok;
                const localCadastrado = res.body;

                request(app).get(`${_.CONSTANTES_LOCAL.URI}/${localCadastrado._id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(_.OK).end((err, res) => {

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
            request(app).delete(`${_.CONSTANTES_LOCAL.URI}/${mongoose.Types.ObjectId()}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(_.NOT_FOUND).end((err, res) => {

                expect(err).to.not.be.ok;

                const resposta = res.body;
                expect(resposta.mensagem).to.be.eql(_.CONSTANTES_LOCAL.ERRO_LOCAL_NAO_ENCONTRADO);
                done();
            });
        });

        it('retornar o local removido e remover o mesmo corretamente', done => {
            const localMock = LocaisMock.getLocal();

            // Cadastrar Local
            request(app).post(_.CONSTANTES_LOCAL.URI)
                .set('Authorization', `Bearer ${token}`)
                .send(localMock)
                .expect(_.CREATED).end((err, res) => {

                expect(err).to.not.be.ok;
                const localCadastrado = res.body;

                // Deletar local
                request(app).delete(`${_.CONSTANTES_LOCAL.URI}/${localCadastrado._id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(_.OK).end((err, res) => {

                    expect(err).to.not.be.ok;

                    const localRemovido = res.body;
                    expect(localRemovido).to.be.eql(localCadastrado);

                    // Consulta novamente o local.
                    request(app).get(`${_.CONSTANTES_LOCAL.URI}/${localCadastrado._id}`)
                        .set('Authorization', `Bearer ${token}`)
                        .expect(_.NOT_FOUND).end((err, res) => {

                        expect(err).to.not.be.ok;

                        const resposta = res.body;
                        expect(resposta.mensagem).to.be.eql(_.CONSTANTES_LOCAL.ERRO_LOCAL_NAO_ENCONTRADO);
                        done();
                    });
                });
            });
        });
    });

    describe('PATCH /api/locais/:id', () => {
        let localCadastrado;

        beforeEach(done => {
            const localMock = LocaisMock.getLocal();
            request(app).post(_.CONSTANTES_LOCAL.URI)
                .set('Authorization', `Bearer ${token}`)
                .send(localMock)
                .expect(_.CREATED).end((err, res) => {

                expect(err).to.not.be.ok;
                localCadastrado = res.body;
                done()
            });
        });

        it('retornar 403 (Forbidden) se o usuário não possuir role admin', done => {
            const metodoHttp = 'PATCH',
                uri = `${_.CONSTANTES_LOCAL.URI}/${mongoose.Types.ObjectId()}`,
                reqBody = LocaisMock.getLocal();
            testeEndPointForbidden({metodoHttp, uri, reqBody, done});
        });

        it('retornar corretamente o erro caso haja', done => {
            const novoLocal = _.clone(localCadastrado);
            delete novoLocal.bloco;
            request(app).patch(`${_.CONSTANTES_LOCAL.URI}/${localCadastrado._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(novoLocal)
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
            request(app).patch(`${_.CONSTANTES_LOCAL.URI}/${localCadastrado._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(novoLocal)
                .expect(_.OK).end((err, res) => {

                expect(err).to.not.be.ok;
                const localAtualizado = res.body;
                expect(localAtualizado).to.be.eql(novoLocal);
                done();
            });
        });
    });
});
