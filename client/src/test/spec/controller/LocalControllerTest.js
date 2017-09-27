(() => {
    'use strict';

    describe('LocalControllerTest', function () {

        beforeEach(module('stateMock', 'Mocks', 'scoreApp'));

        let createController, $scope, AuthService, ToastService, LocaisMock, UsuarioMock;
        const self = this;
        let local, usuario;

        beforeEach(inject(defaultInjections(self)));
        afterEach(defaultAfterEach(self));

        beforeEach(inject(function ($controller, _AuthService_, _ToastService_, _LocaisMock_, _UsuarioMock_) {
            $scope = self.$rootScope.$new();
            AuthService = _AuthService_;
            ToastService = _ToastService_;
            LocaisMock = _LocaisMock_;
            UsuarioMock = _UsuarioMock_;

            local = LocaisMock.getLocal();
            usuario = UsuarioMock.getUsuario();

            AuthService.getUsuarioLogado = sinon.stub().returns(usuario);
            createController = function () {
                return $controller('LocalController', {
                    $scope,
                    AuthService,
                    ToastService,
                    local
                });
            };
        }));

        describe('LocalController admin deve', () => {
            it('ser false caso o usuário não seja administrador', () => {
                expect(usuario.app_metadata.permissoes).to.be.empty;
                const controller = createController();
                expect(controller.admin).to.be.false;
            });

            it('ser true caso o usuário seja administrador', () => {
                usuario = UsuarioMock.getUsuarioAdmin();
                AuthService.getUsuarioLogado.returns(usuario);
                const controller = createController();
                expect(controller.admin).to.be.true;
            });
        });
    });
})();
