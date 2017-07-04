(function () {
    'use strict';

    /**
     * Tests the AuthService. Checks if it's behaviour is correct.
     *
     * @author Estácio Pereira, Lucas Diniz
     */
    describe('AuthServiceTest', function () {

        beforeEach(module('scoreApp', 'stateMock', 'Mocks'));

        var store, auth, AuthService, ToastService, UserMock;
        var self = this;

        beforeEach(inject(defaultInjections(self)));

        beforeEach(inject(function (_store_, _auth_, _AuthService_, _ToastService_, _UserMock_) {
            store = _store_;
            auth = _auth_;
            AuthService = _AuthService_;
            ToastService = _ToastService_;
            UserMock = _UserMock_;
        }));

        describe('logout should', function () {
            it('clear the user of the service and the local storage', function () {

                var user = UserMock.get();
                var token = 'token';
                var getProfileStub = sinon.stub(auth, 'getProfile');


                assert.equal(AuthService.getLoggedUser(), null);
                assert.equal(AuthService.getIdToken(), null);
                AuthService.isAuthenticated().should.equal(false);

                AuthService.authenticate(token, user);

                assert.equal(AuthService.getLoggedUser(), user);
                assert.equal(AuthService.getIdToken(), token);
                AuthService.isAuthenticated().should.equal(true);

                AuthService.logout();

                AuthService.isAuthenticated().should.equal(false);
                assert.equal(AuthService.getLoggedUser(), null);
                assert.equal(AuthService.getIdToken(), null);
            });
        });

        describe('authenticate should', function () {
            it('store the user, the token and authenticate the user', function (done) {
                var user = UserMock.get();
                var token = 'token';
                var storeSetStub = sinon.stub(store, 'set');
                var authenticateStub = sinon.stub(auth, 'authenticate');
                var promise = AuthService.authenticate(token, user);
                promise.should.be.fulfilled.then(function (user) {
                    expect(storeSetStub.calledWith('user', JSON.stringify(user))).to.be.true;
                    expect(storeSetStub.calledWith('idToken', token)).to.be.true;
                    expect(authenticateStub.called).to.be.true;
                }).should.notify(done);
                self.$rootScope.$digest();
            });

            it('request the user, if only the token is given', function (done) {
                var user = UserMock.get();
                var token = 'token';
                var storeSetStub = sinon.stub(store, 'set');
                var authenticateStub = sinon.stub(auth, 'authenticate');

                self.$httpBackend.expectGET('/api/users').respond(user);
                var promise = AuthService.authenticate(token);
                promise.should.be.fulfilled.then(function (user) {
                    expect(storeSetStub.calledWith('user', JSON.stringify(user))).to.be.true;
                    expect(storeSetStub.calledWith('idToken', token)).to.be.true;
                    expect(authenticateStub.called).to.be.true;
                }).should.notify(done);
                self.$httpBackend.flush();
            });

            it('request the user, and show the toast if the token is invalid', function (done) {
                var user = UserMock.get();
                var token = 'token';
                var storeSetStub = sinon.stub(store, 'set');
                var authenticateStub = sinon.stub(auth, 'authenticate');
                var toastStub = sinon.stub(ToastService, 'showActionToast');

                self.$httpBackend.expectGET('/api/users').respond(401);
                var promise = AuthService.authenticate(token);
                promise.should.be.fulfilled.then(function (user) {
                    expect(user).to.be.undefined;
                    expect(storeSetStub.calledWith('idToken', token)).to.be.true;
                    expect(toastStub.called).to.be.true;
                    expect(authenticateStub.called).to.be.false;
                }).should.notify(done);
                self.$httpBackend.flush();
            });
        });


        describe('isAuthenticated should', function () {
            beforeEach(function () {
                if (AuthService.isAuthenticated()) {
                    AuthService.logout();
                }
            });

            it('return TRUE if the user is already authenticated', function () {
                var user = UserMock.get();
                var token = 'token';
                var getProfileStub = sinon.stub(auth, 'getProfile');

                AuthService.authenticate(token, user);
                AuthService.isAuthenticated().should.equal(true);
            });

            it('return FALSE if the user is NOT authenticated', function () {
                var user = UserMock.get();
                var token = 'token';

                // AuthService.authenticate(token, user);
                AuthService.isAuthenticated().should.equal(false);
            });
        });


        describe('getLoggedUser should', function () {
            beforeEach(function () {
                if (AuthService.isAuthenticated()) {
                    AuthService.logout();
                }
            });

            it('return a User object if the user is logged in', function () {
                var user = UserMock.get();
                var token = 'token';
                var getProfileStub = sinon.stub(auth, 'getProfile');

                AuthService.authenticate(token, user);
                assert.equal(AuthService.getLoggedUser(), user);
            });

            it('return NULL if the user is no user logged in', function () {
                var user = UserMock.get();
                var token = 'token';

                // AuthService.authenticate(token, user);
                assert.equal(AuthService.getLoggedUser(), null);
            });
        });


        describe('getIdToken should', function () {
            beforeEach(function () {
                if (AuthService.isAuthenticated()) {
                    AuthService.logout();
                }
            });

            it('return the token of the logged user, if there is one', function () {
                var user = UserMock.get();
                var token = 'token';
                var getProfileStub = sinon.stub(auth, 'getProfile');

                AuthService.authenticate(token, user);
                assert.equal(AuthService.getIdToken(), token);
                assert.equal(AuthService.getIdToken(), 'token');
            });

            it('return NULL if the user is not logged in', function () {
                var user = UserMock.get();
                var token = 'token';

                // AuthService.authenticate(token, user);
                assert.equal(AuthService.getIdToken(), null);
            });
        });
    });
})();
