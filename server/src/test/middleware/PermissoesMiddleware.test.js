import '../testSetup';

import {PermissoesMiddleware} from "../../main/middleware/permissoes/PermissoesMiddleware"
import {UsersService} from '../../main/service/usersService';
import UsersMock from '../../mock/usersMock';
import _ from '../../main/util/util';

describe('PermissoesMiddlewareTest', () => {

    const token = UsersMock.getToken();
    let res, req, next;
    beforeEach(function () {
        req = {
            header: sinon.stub().returns(token)
        };
        res = new function () {
            this.status = sinon.stub().returns(this);
            this.json = sinon.stub().returns(this);
        };
        next = sinon.stub();
    });

    describe('getReservasMiddleware deve', () => {
        it('retornar um middleware para verificar permissão de reservas e deixar passar se usuário tiver permissão', async () => {
            const reservasMiddleware = PermissoesMiddleware.getReservasMiddleware();
            UsersMock.cacheUsuarioReservas(UsersService);
            await reservasMiddleware(req, res, next);

            sinon.assert.calledWith(req.header, _.ACCESS_TOKEN);
            sinon.assert.notCalled(res.status);
            sinon.assert.notCalled(res.json);
            sinon.assert.called(next);
        });

        it('aceitar usuario com permissão de Admin', async () => {
            const reservasMiddleware = PermissoesMiddleware.getReservasMiddleware();
            UsersMock.cacheUsuarioAdmin(UsersService);

            await reservasMiddleware(req, res, next);
            
            sinon.assert.calledWith(req.header, _.ACCESS_TOKEN);
            sinon.assert.notCalled(res.status);
            sinon.assert.notCalled(res.json);
            sinon.assert.called(next);
        });

        it('enviar mensagem de erro se usuário não tiver permissão', async () => {
            const reservasMiddleware = PermissoesMiddleware.getReservasMiddleware();
            const next = sinon.stub();
            UsersMock.cacheUsuarioComum(UsersService);

            await reservasMiddleware(req, res, next)
            sinon.assert.calledWith(req.header, _.ACCESS_TOKEN);
            sinon.assert.calledWith(res.status, _.FORBIDDEN);
            sinon.assert.calledWith(res.json, {mensagem: _.ERRO_USUARIO_SEM_PERMISSAO});
            sinon.assert.notCalled(next);
        });
    });

    describe('getAdminMiddleware deve', () => {
        it('retornar um middleware para verificar permissão de Admin e deixar passar se usuário tiver permissão', async () => {
            const adminMiddleware = PermissoesMiddleware.getAdminMiddleware();
            UsersMock.cacheUsuarioAdmin(UsersService);

            await adminMiddleware(req, res, next);
            sinon.assert.calledWith(req.header, _.ACCESS_TOKEN);
            sinon.assert.notCalled(res.status);
            sinon.assert.notCalled(res.json);
            sinon.assert.called(next);
        });

        it('enviar mensagem de erro se usuário não tiver permissão', async () => {
            const adminMiddleware = PermissoesMiddleware.getAdminMiddleware();
            const next = sinon.stub();
            UsersMock.cacheUsuarioComum(UsersService);
            
            await adminMiddleware(req, res, next);
            sinon.assert.calledWith(req.header, _.ACCESS_TOKEN);
            sinon.assert.calledWith(res.status, _.FORBIDDEN);
            sinon.assert.calledWith(res.json, {mensagem: _.ERRO_USUARIO_SEM_PERMISSAO});
            sinon.assert.notCalled(next);
        });
    });
});