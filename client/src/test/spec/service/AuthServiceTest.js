(function () {
    'use strict';

    /**
     * Teste de AuthService. Checa se seu comportamento eh correto.
     *
     * @author Estácio Pereira, Lucas Diniz
     */
    describe('AuthServiceTest', function () {

        beforeEach(module('stateMock', 'Mocks', 'scoreApp'));

        var store, auth, AuthService, ToastService, UsuarioMock;
        var self = this;

        beforeEach(inject(defaultInjections(self)));

        beforeEach(inject(function (_store_, _auth_, _AuthService_, _ToastService_, _UsuarioMock_) {
            store = _store_;
            auth = _auth_;
            AuthService = _AuthService_;
            ToastService = _ToastService_;
            UsuarioMock = _UsuarioMock_;
        }));

        describe.skip('deve ser logout', function () {
            it('limpar o usuario do servico e do repositorio local', function () {

                var user = UsuarioMock.get();
                var token = 'token';
                var getProfileStub = sinon.stub(auth, 'getProfile');


                assert.equal(AuthService.getUsuarioLogado(), null);
                assert.equal(AuthService.getIdToken(), null);
                AuthService.isAuthenticated().should.equal(false);

                AuthService.authenticate(token, user);

                assert.equal(AuthService.getUsuarioLogado(), user);
                assert.equal(AuthService.getIdToken(), token);
                AuthService.isAuthenticated().should.equal(true);

                AuthService.logout();

                AuthService.isAuthenticated().should.equal(false);
                assert.equal(AuthService.getUsuarioLogado(), null);
                assert.equal(AuthService.getIdToken(), null);
            });
        });

        describe.skip('deve ser authenticate', function () {
            it('salvar o usuario, o token e autenticar o usuario', function (done) {
                var user = UsuarioMock.get();
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

            it('solicitar usuario, se for dado somente o token', function (done) {
                var user = UsuarioMock.get();
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

            it('solicitar usuario, e mostrar o toast se o token eh invalido', function (done) {
                var user = UsuarioMock.get();
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


        describe.skip('deve ser isAuthenticated', function () {
            beforeEach(function () {
                if (AuthService.isAuthenticated()) {
                    AuthService.logout();
                }
            });

            it('retornar TRUE se o usuario ja esta autenticado', function () {
                var user = UsuarioMock.get();
                var token = 'token';
                var getProfileStub = sinon.stub(auth, 'getProfile');

                AuthService.authenticate(token, user);
                AuthService.isAuthenticated().should.equal(true);
            });

            it('retornar FALSE se o usuario nao esta autenticado', function () {
                var user = UsuarioMock.get();
                var token = 'token';

                // AuthService.authenticate(token, user);
                AuthService.isAuthenticated().should.equal(false);
            });
        });


        describe.skip('deve getUsuarioLogado', function () {
            beforeEach(function () {
                if (AuthService.isAuthenticated()) {
                    AuthService.logout();
                }
            });

            it('retornar um objeto Usuario se o usuario esta logado', function () {
                var user = UsuarioMock.get();
                var token = 'token';
                var getProfileStub = sinon.stub(auth, 'getProfile');

                AuthService.authenticate(token, user);
                assert.equal(AuthService.getUsuarioLogado(), user);
            });

            it('retornar NULL se o usuario nao eh um usuario logado', function () {
                var user = UsuarioMock.get();
                var token = 'token';

                // AuthService.authenticate(token, user);
                assert.equal(AuthService.getUsuarioLogado(), null);
            });
        });


        describe.skip('deve getIdToken', function () {
            beforeEach(function () {
                if (AuthService.isAuthenticated()) {
                    AuthService.logout();
                }
            });

            it('retornar o token do usuario logado, se existir um', function () {
                var user = UsuarioMock.get();
                var token = 'token';
                var getProfileStub = sinon.stub(auth, 'getProfile');

                AuthService.authenticate(token, user);
                assert.equal(AuthService.getIdToken(), token);
                assert.equal(AuthService.getIdToken(), 'token');
            });

            it('retornar NULL se o usuario nao esta logado', function () {
                var user = UsuarioMock.get();
                var token = 'token';

                // AuthService.authenticate(token, user);
                assert.equal(AuthService.getIdToken(), null);
            });
        });
    });
})();
