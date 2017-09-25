(function () {
    'use strict';

    describe('LoginControllerTest', function () {

        beforeEach(module('stateMock', 'Mocks', 'scoreApp'));

        var createController, scope, AuthService, UsuarioMock, ToastService;
        var self = this;

        beforeEach(inject(defaultInjections(self)));

        beforeEach(inject(function (_$rootScope_, $controller, _AuthService_, _ToastService_, _UsuarioMock_) {
            AuthService = _AuthService_;
            ToastService = _ToastService_;
            UsuarioMock = _UsuarioMock_;
            scope = _$rootScope_.$new();

            createController = function () {
                return $controller('LoginController', {
                    $scope: scope,
                    AuthService: AuthService,
                    ToastService: ToastService
                });
            };
        }));
    });
})();
