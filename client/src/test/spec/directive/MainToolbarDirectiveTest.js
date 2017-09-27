(() => {
    'use strict';

    describe('MainToolbarDirectiveTest', () => {

        beforeEach(module('stateMock', 'scoreApp'));

        const self = this;
        const sandbox = sinon.createSandbox();

        beforeEach(module(function ($provide) {
            $provide.service('$mdSidenav', function () {
                this.isOpen = sandbox.stub();
                this.close = sandbox.stub();
                this.toggle = sandbox.stub();
                return sandbox.stub().returns(this);
            });
        }));

        beforeEach(inject(defaultInjections(self)));
        afterEach(defaultAfterEach(self));

        let $scope, compile, element, $mdSidenav, APP_STATES, AuthLockService, AuthService;
        const MAIN_SIDENAV = 'main-sidenav';
        beforeEach(inject(function ($compile, $templateCache, _$mdSidenav_, _APP_STATES_, _AuthLockService_, _AuthService_) {
            $scope = self.$rootScope.$new();
            compile = $compile;
            $mdSidenav = _$mdSidenav_;
            APP_STATES = _APP_STATES_;
            AuthLockService = _AuthLockService_;
            AuthService = _AuthService_;

            const toolbarHtml = $templateCache.get("src/main/view/mainToolbar.html");
            $templateCache.put("./view/mainToolbar.html", toolbarHtml);

            element = angular.element(
                `<main-toolbar></main-toolbar>`
            );
            element = $compile(element)($scope);

            $scope.$digest();
        }));

        afterEach(() => {
            sandbox.verifyAndRestore();
        });

        describe('MainToolbarDirective toggleBarraLateral deve', () => {
            it('fechar a barra se ela estiver aberta', () => {
                const diretiva = element.isolateScope();
                $mdSidenav().isOpen.returns(true);
                diretiva.toggleBarraLateral();

                sandbox.assert.calledWith($mdSidenav, MAIN_SIDENAV);
                sandbox.assert.calledOnce($mdSidenav().isOpen);
                sandbox.assert.calledOnce($mdSidenav().close);
                sandbox.assert.notCalled($mdSidenav().toggle);
            });

            it('chamar função toggle se ela não estiver aberta', () => {
                const diretiva = element.isolateScope();
                $mdSidenav().isOpen.returns(false);
                diretiva.toggleBarraLateral();

                sandbox.assert.calledWith($mdSidenav, MAIN_SIDENAV);
                sandbox.assert.calledOnce($mdSidenav().isOpen);
                sandbox.assert.notCalled($mdSidenav().close);
                sandbox.assert.calledOnce($mdSidenav().toggle);
            });
        });

        describe('MainToolbarDirective sair deve', () => {
            it('chamar função de logout e ir para state de login', () => {
                const diretiva = element.isolateScope();

                self.$state.expectTransitionTo(APP_STATES.LOGIN.nome);
                sandbox.stub(diretiva.auth, 'logout');
                diretiva.sair();

                sandbox.assert.calledOnce(diretiva.auth.logout);
            });
        });

        describe('MainToolbarDirective entrar deve', () => {
            it('mostrar modal do Auth0 e iniciar verificações pelos campos do modal', () => {
                const diretiva = element.isolateScope();

                sandbox.stub(diretiva.lock, 'show');
                sandbox.stub(AuthLockService, 'inicializarVerificacoes');

                diretiva.entrar();

                sandbox.assert.calledOnce(diretiva.lock.show);
                sandbox.assert.calledOnce(AuthLockService.inicializarVerificacoes);
            });
        });

        describe('MainToolbarDirective autenticar deve', () => {
            const idToken = 'idToken', accessToken = 'accessToken';
            it('chamar função para recuperar perfil do lock passando o token de parâmetro', () => {
                const diretiva = element.isolateScope();

                diretiva.autenticar({idToken});
                expect(diretiva.lock._getProfileArgs).to.contain(idToken);
            });

            it('realizar log do erro caso haja e não autenticar', () => {
                const diretiva = element.isolateScope();

                const callback = diretiva.autenticar({idToken});
                expect(diretiva.lock._getProfileArgs).to.contain(idToken);

                sandbox.stub(console, 'log');
                sandbox.stub(AuthService, 'authenticate');

                callback('NewPointerException');
                sandbox.assert.calledWith(console.log, `Erro em autenticação: NewPointerException`);
                sandbox.assert.notCalled(AuthService.authenticate);
            });

            it('autenticar e redirecionar caso haja sucesso', () => {
                const diretiva = element.isolateScope();

                const callback = diretiva.autenticar({idToken, accessToken});
                expect(diretiva.lock._getProfileArgs).to.contain(idToken, accessToken);
                expect(diretiva.usuario).to.be.not.ok;

                sandbox.stub(console, 'log');
                sandbox.stub(AuthService, 'authenticate');

                self.$state.expectTransitionTo(APP_STATES.AGENDA_INFO.nome);
                callback(null, {});

                sandbox.assert.calledWith(AuthService.authenticate, accessToken, idToken, diretiva.usuario);
                expect(diretiva.usuario).to.be.ok;
            });
        });

        describe('MainToolbarDirective getNomeDoEstadoAtual deve', () => {
            it('retornar SCORE se o estado atual for o da agenda ou de login', () => {
                self.$state.current = {name: APP_STATES.LOGIN.nome};

                const diretiva = element.isolateScope();
                expect(diretiva.getNomeDoEstadoAtual()).to.be.eql('SCORE');

                self.$state.current = {name: APP_STATES.AGENDA_INFO.nome};
                expect(diretiva.getNomeDoEstadoAtual()).to.be.eql('SCORE');
            });

            it('retornar o nome principal do state maiúsculo', () => {
                const nomeState = 'app.local';
                const nomeEsperado = 'LOCAL';
                self.$state.current = {
                    nome: nomeState,
                    name: APP_STATES.LOCAL.nome
                };

                const diretiva = element.isolateScope();
                expect(diretiva.getNomeDoEstadoAtual()).to.be.eql(nomeEsperado);
            });
        });


        describe('MainToolbarDirective getNomeState deve', () => {
            it('retornar o último nome (apenas com letras) do nome completo do state', () => {
                const diretiva = element.isolateScope();
                expect(diretiva.getNomeState('app.local')).to.be.eql('local');
                expect(diretiva.getNomeState('app.login')).to.be.eql('login');
                expect(diretiva.getNomeState('app.local.reserva')).to.be.eql('reserva');
                expect(diretiva.getNomeState('app.local.reserva2')).to.be.eql('reserva');
            });
        });

        describe('MainToolbarDirective irParaInicio deve', () => {
            it('realizar transição para tela da agenda se o usuário estiver autenticado', () => {
                const diretiva = element.isolateScope();

                sandbox.stub(diretiva.auth, 'isAuthenticated');
                diretiva.auth.isAuthenticated.returns(true);

                self.$state.expectTransitionTo(APP_STATES.AGENDA_INFO.nome);
                diretiva.irParaInicio();
            });

            it('realizar transição para tela da login se o usuário não estiver autenticado', () => {
                const diretiva = element.isolateScope();

                sandbox.stub(diretiva.auth, 'isAuthenticated');
                diretiva.auth.isAuthenticated.returns(false);

                self.$state.expectTransitionTo(APP_STATES.LOGIN.nome);
                diretiva.irParaInicio();
            });
        });

        describe('MainToolbarDirective init deve', () => {
            it('inicializar o lock do Auth0 e estabelecer um callback para autenticação', () => {
                const diretiva = element.isolateScope();

                expect(diretiva.lock instanceof Auth0Lock).to.be.true;
                expect(diretiva.lock._constructorArgs).to.be.eql([AUTH0_CLIENT_ID, AUTH0_DOMAIN, LOCK_CONFIG]);
                expect(diretiva.lock._onArgs).to.be.contain('authenticated');
            });
        });
    });
})();