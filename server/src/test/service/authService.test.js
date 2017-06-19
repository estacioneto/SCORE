(function () {
    'use strict';

    let assert = require('assert'),
        chai = require('chai'),
        sinon = require('sinon'),
        should = require('should'),
        clone = require('clone');
    let expect = chai.expect;
    let _ = require('../../main/util/util');

    /**
     * Tests the AuthService. Useful to see our integration with Auth0, but not viable to execute
     * with the other tests.
     *
     * @author Estácio Pereira.
     */
    describe.skip('authServiceTest', () => {
        let authService, UserMock;

        before(done => {
            authService = require('../../main/service/authService');
            UserMock = require('../../mock/usersMock');
            done();
        });

        describe('login should', () => {
            it('not throw error if the user is valid', done => {
                let user = UserMock.getValidUser();
                authService.login(user, (err, result) => {
                    expect(err).to.not.be.ok;
                    expect(result).to.be.ok;
                    done();
                });
            });

            it('throw error, showing the status, if the user is not valid', done => {
                let user = UserMock.getValidUser();
                user.password = '';
                authService.login(user, (err, result) => {
                    expect(err).to.be.ok;
                    expect(result).to.not.be.ok;
                    expect(err.indexOf(_.BAD_REQUEST.toString())).to.not.be.equal(_.INVALID_INDEX);
                    done();
                });
            });
        });

        describe('getUser should', () => {
            it('return the user with the correct identification token', done => {
                let user = UserMock.getValidUser();
                authService.login(user, (err, result) => {
                    expect(err).to.not.be.ok;
                    expect(result).to.be.ok;
                    authService.getUser(result, (err, result) => {
                        expect(err).to.not.be.ok;
                        expect(result).to.be.ok;
                        expect(result.email).to.be.equal(user.username);
                        done();
                    });
                });
            });

            it('throw error, showing the status, if the user is not valid', done => {
                authService.getUser('', (err, result) => {
                    expect(err).to.be.ok;
                    expect(result).to.not.be.ok;
                    expect(err.indexOf(_.BAD_REQUEST.toString())).to.not.be.equal(_.INVALID_INDEX);
                    done();
                });
            });
        });
    });
})();
