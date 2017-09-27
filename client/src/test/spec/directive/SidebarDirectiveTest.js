(() => {
    'use strict';

    describe('SidebarDirectiveTest', () => {

        beforeEach(module('stateMock', 'Mocks', 'scoreApp'));

        const self = this;
        const sandbox = sinon.createSandbox();

        beforeEach(inject(defaultInjections(self)));
        afterEach(defaultAfterEach(self));

        let $scope, $window, compile, element, $mdSidenav, AuthService, UsuarioMock, ModalService;
        let usuario;
        const GIT_URL = 'https://github.com/estacioneto/SCORE';
        beforeEach(inject(function ($compile, $templateCache, _$window_, _$mdSidenav_, _AuthService_, _UsuarioMock_, _ModalService_) {
            $scope = self.$rootScope.$new();
            compile = $compile;
            $mdSidenav = _$mdSidenav_;
            AuthService = _AuthService_;
            ModalService = _ModalService_;
            $window = _$window_;
            UsuarioMock = _UsuarioMock_;

            usuario = UsuarioMock.getUsuario();

            AuthService.getUsuarioLogado = sandbox.stub().returns(usuario);

            const sidebarHrml = $templateCache.get("src/main/view/sidebar.html");
            $templateCache.put("./view/sidebar.html", sidebarHrml);

            element = angular.element(
                `<sidebar></sidebar>`
            );
            element = $compile(element)($scope);

            $scope.$digest();
        }));

        afterEach(() => {
            sandbox.verifyAndRestore();
        });

        describe('Sidebar getNomeEmail deve', () => {
            it('retornar apenas o nome no email do usuário', () => {
                const diretiva = element.isolateScope();
                const nome = 'estacio.neto';
                const dominio = '@gmail.com';

                diretiva.usuario.email = `${nome}${dominio}`;
                expect(diretiva.getNomeEmail()).to.be.eql(nome);
            });
        });

        describe('Sidebar getDominioEmail deve', () => {
            it('retornar apenas o domínio (incluindo @) do email do usuário', () => {
                const diretiva = element.isolateScope();
                const nome = 'estacio.neto';
                const dominio = '@gmail.com';

                diretiva.usuario.email = `${nome}${dominio}`;
                expect(diretiva.getDominioEmail()).to.be.eql(dominio);
            });
        });

        describe('Sidebar sobreDesenvolvedores deve', () => {
            it('chamar modal de exibição de informação dos desenvolvedores', () => {
                const diretiva = element.isolateScope();
                const $event = {};

                ModalService.exibirModalSobreDesenvolvedores = sandbox.stub();
                diretiva.sobreDesenvolvedores($event);

                sandbox.assert.calledWith(ModalService.exibirModalSobreDesenvolvedores, $event);
            });
        });

        describe('Sidebar goIssuesGithub deve', () => {
            it('abrir uma nova aba na página de issues do projeto', () => {
                const diretiva = element.isolateScope();
                $window.open = sandbox.stub();

                diretiva.goIssuesGithub(`${GIT_URL}/issues`);
            });
        });

        describe('Sidebar goGithub deve', () => {
            it('abrir uma nova aba na página principal do projeto', () => {
                const diretiva = element.isolateScope();
                $window.open = sandbox.stub();

                diretiva.goIssuesGithub(`${GIT_URL}`);
            });
        });
    });
})();