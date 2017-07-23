(function () {
    'use strict';

    let assert = require('assert'),
        chai = require('chai'),
        sinon = require('sinon'),
        should = require('should'),
        clone = require('clone'),
        mockery = require('mockery');
    let expect = chai.expect;
    let _ = require('../../main/util/util');

    /**
     * Tests the UsersService. We need to secure the integrity of it's behavior, specially
     * the cache.
     *
     * @author Estácio Pereira.
     */
    describe('usersServiceTest', () => {
        let UserService, UserMock;

        before(done => {
            UserService = require('../../main/service/usersService');
            UserMock = require('../../mock/usersMock');
            done();
        });

        describe('isCached should', () => {
            it('return true if the user is in the cache', () => {
                let user = UserMock.getValidUser();
                UserService.cacheUser('token', user);
                expect(UserService.isCached(user)).to.be.true;
            });

            it('return false if the user is not in the cache', () => {
                let user = UserMock.getValidUser();
                UserService.cacheUser('token', user);
                expect(UserService.isCached(user)).to.be.true;
                user.username = 'piton';
                expect(UserService.isCached(user)).to.be.false;
            });
        });

        describe('cacheUser should', () => {
            it('add the user correctly and as a string', () => {
                let user = UserMock.getValidUser();
                let token = UserMock.getToken();
                UserService.cache = {};
                UserService.cacheUser(token, user);
                expect(UserService.cache[token]).to.be.ok;
                expect(UserService.cache[token].value).to.be.equal(JSON.stringify(user));
            });

            it('not add something to the cache with the key falsy', () => {
                let user = UserMock.getValidUser();
                UserService.cache = {};
                UserService.cacheUser(null, user);
                expect(UserService.cache).to.be.empty;
                UserService.cacheUser('', user);
                expect(UserService.cache).to.be.empty;
            });

            it('update the user if it has another identification token', () => {
                let user = UserMock.getValidUser();
                let token = UserMock.getToken();
                UserService.cache = {};
                UserService.cacheUser(token, user);
                expect(UserService.cache[token]).to.be.ok;
                expect(UserService.cache[token].value).to.be.equal(JSON.stringify(user));
                UserService.cacheUser(token + token, user);
                expect(UserService.cache[token]).to.not.be.ok;
                expect(UserService.cache[token + token].value).to.be.equal(JSON.stringify(user));
            });
        });

        describe('getUser should', () => {
            let authStub, getUserStub, usuarioRetornado;

            before(() => {
                mockery.enable({
                    warnOnReplace: false,
                    warnOnUnregistered: false,
                    useCleanCache: true
                });

                authStub = sinon.stub();
                mockery.registerMock('./authService', {AuthService: authStub});
                authStub.getUser = () => {
                };

                usuarioRetornado = UserMock.getValidUser();
                usuarioRetornado.username = 'POST-STUB';
                getUserStub = sinon.stub(authStub, 'getUser', (options, callback) => callback(null, usuarioRetornado));
                UserService = require('../../main/service/usersService');
            });

            after(() => {
                mockery.disable();
                UserService = require('../../main/service/usersService');
            });

            it('return the user without request auth0 when it is cached', done => {
                let user = UserMock.getValidUser();
                let token = UserMock.getToken();
                UserService.cache = {};
                UserService.cacheUser(token, user);
                UserService.getUser(token, (err, result) => {
                    expect(err).to.not.be.ok;
                    expect(result).to.be.deep.equal(user);
                    sinon.assert.notCalled(authStub);
                    sinon.assert.notCalled(getUserStub);
                    done();
                });
            });

            it('return the user requesting auth0 when it is not cached and add the user to the cache', done => {
                UserService.cache = {};
                let token = UserMock.getToken();

                UserService.getUser(token, (err, result) => {
                    expect(err).to.not.be.ok;
                    expect(result).to.be.deep.equal(usuarioRetornado);
                    sinon.assert.notCalled(authStub);
                    sinon.assert.calledOnce(getUserStub);
                    expect(UserService.cache).to.not.be.empty;
                    expect(UserService.isCached(usuarioRetornado)).to.be.true;
                    done();
                });
            });
        });
    });
})();
