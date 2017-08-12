require('../testSetup');

import {PermissoesMiddleware} from "../../main/middleware/permissoes/PermissoesMiddleware"
import UsersService from '../../main/service/usersService';
import UsersMock from '../../mock/usersMock';
import _ from '../../main/util/util';

describe('PermissoesMiddlewareTest', () => {

    const token = UsersMock.getToken();
    let res, req;
    beforeEach(function () {
        req = {
            header: sinon.stub().returns(token)
        };
        res = new function () {
            this.status = sinon.stub().returns(this);
            this.json = sinon.stub().returns(this);
        };
    });

    describe('getReservasMiddleware deve', () => {
        it('retornar um middleware para verificar permissão de reservas e deixar passar se usuário tiver permissão', done => {
            const reservasMiddleware = PermissoesMiddleware.getReservasMiddleware();
            UsersMock.cacheUsuarioReservas(UsersService);
            reservasMiddleware(req, res, () => {
                sinon.assert.calledWith(req.header, _.ACCESS_TOKEN);
                sinon.assert.notCalled(res.status);
                sinon.assert.notCalled(res.json);
                done();
            });
        });

        it('enviar mensagem de erro se usuário não tiver permissão', () => {
            const reservasMiddleware = PermissoesMiddleware.getReservasMiddleware();
            const next = sinon.stub();
            UsersMock.cacheUsuarioComum(UsersService);

            return reservasMiddleware(req, res, next).then(info => {
                assert.fail('Deveria ter dado erro, pois o usuário não tem permissão.', info);
            }, err => {
                sinon.assert.calledWith(req.header, _.ACCESS_TOKEN);
                sinon.assert.calledWith(res.status, _.FORBIDDEN);
                sinon.assert.calledWith(res.json, {mensagem: _.ERRO_USUARIO_SEM_PERMISSAO});
                sinon.assert.notCalled(next);
            });
        });
    });

    describe('getAdminMiddleware deve', () => {
        it('retornar um middleware para verificar permissão de Admin e deixar passar se usuário tiver permissão', done => {
            const adminMiddleware = PermissoesMiddleware.getAdminMiddleware();
            UsersMock.cacheUsuarioAdmin(UsersService);
            adminMiddleware(req, res, () => {
                sinon.assert.calledWith(req.header, _.ACCESS_TOKEN);
                sinon.assert.notCalled(res.status);
                sinon.assert.notCalled(res.json);
                done();
            });
        });

        it('enviar mensagem de erro se usuário não tiver permissão', () => {
            const adminMiddleware = PermissoesMiddleware.getAdminMiddleware();
            const next = sinon.stub();
            UsersMock.cacheUsuarioComum(UsersService);
            return adminMiddleware(req, res, next).then(info => {
                assert.fail('Deveria ter dado erro, pois o usuário não tem permissão.', info);
            }, err => {
                sinon.assert.calledWith(req.header, _.ACCESS_TOKEN);
                sinon.assert.calledWith(res.status, _.FORBIDDEN);
                sinon.assert.calledWith(res.json, {mensagem: _.ERRO_USUARIO_SEM_PERMISSAO});
                sinon.assert.notCalled(next);
            });
        });
    });
});