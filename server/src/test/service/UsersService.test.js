import '../testSetup';
import {UsersService} from "../../main/service/usersService";
import {AuthService} from "../../main/service/authService";
import UserMock from '../../mock/usersMock';

/**
 * Testa o UsersService. Precisa assegurar a integridade de seu comportamento, especialmente
 * para o cache.
 *
 * @author Estácio Pereira.
 */
describe('usersServiceTest', () => {

    describe('isCached should', () => {
        it('return true if the user is in the cache', () => {
            let user = UserMock.getValidUser();
            UsersService.cachePut('token', user);
            expect(UsersService.isCached(user)).to.be.true;
        });

        it('return false if the user is not in the cache', () => {
            let user = UserMock.getValidUser();
            UsersService.cachePut('token', user);
            expect(UsersService.isCached(user)).to.be.true;
            user.username = 'piton';
            expect(UsersService.isCached(user)).to.be.false;
        });
    });

    describe('cachePut should', () => {
        it('add the user correctly and as a string', () => {
            let user = UserMock.getValidUser();
            let token = UserMock.getToken();
            UsersService._cache = {};
            UsersService.cachePut(token, user);
            expect(UsersService._cache[token]).to.be.ok;
            expect(UsersService._cache[token].value).to.be.equal(JSON.stringify(user));
        });

        it('not add something to the cache with the key falsy', () => {
            let user = UserMock.getValidUser();
            UsersService._cache = {};
            UsersService.cachePut(null, user);
            expect(UsersService._cache).to.be.empty;
            UsersService.cachePut('', user);
            expect(UsersService._cache).to.be.empty;
        });

        it('update the user if it has another identification token', () => {
            let user = UserMock.getValidUser();
            let token = UserMock.getToken();
            UsersService._cache = {};
            UsersService.cachePut(token, user);
            expect(UsersService._cache[token]).to.be.ok;
            expect(UsersService._cache[token].value).to.be.equal(JSON.stringify(user));
            UsersService.cachePut(token + token, user);
            expect(UsersService._cache[token]).to.not.be.ok;
            expect(UsersService._cache[token + token].value).to.be.equal(JSON.stringify(user));
        });
    });

    describe.skip('getUser should', () => {
        let authStub, getProfileStub, usuarioRetornado, sandbox;

        before(() => {
            sandbox = sinon.createSandbox();

            usuarioRetornado = UserMock.getValidUser();
            usuarioRetornado.username = 'POST-STUB';
            sandbox.stub(AuthService, 'getProfile').resolves(usuarioRetornado);
        });

        after(() => {
            sandbox.verifyAndRestore();
        });

        it('return the user without request auth0 when it is cached', done => {
            let user = UserMock.getValidUser();
            let token = UserMock.getToken();
            UsersService._cache = {};
            UsersService.cachePut(token, user);
            UsersService.getUser(token, (err, result) => {
                expect(err).to.not.be.ok;
                expect(result).to.be.deep.equal(user);
                sandbox.assert.notCalled(AuthService.getProfile);
                done();
            });
        });

        it('return the user requesting auth0 when it is not cached and add the user to the cache', done => {
            UsersService._cache = {};
            let token = UserMock.getToken();

            UsersService.getUser(token, (err, result) => {
                expect(err).to.not.be.ok;
                expect(result).to.be.deep.equal(usuarioRetornado);
                sandbox.assert.calledOnce(AuthService.getProfile);
                expect(UsersService._cache).to.not.be.empty;
                expect(UsersService.isCached(usuarioRetornado)).to.be.true;
                done();
            });
        });
    });
});
