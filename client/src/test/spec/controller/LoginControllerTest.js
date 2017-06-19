(function () {
    'use strict';

    describe('LoginControllerTest', function () {

        beforeEach(module('pitonApp', 'stateMock', 'Mocks'));

        var createController, scope, AuthService, UserMock, ToastService;
        var self = this;

        beforeEach(inject(defaultInjections(self)));

        beforeEach(inject(function (_$rootScope_, $controller, _AuthService_, _ToastService_, _UserMock_) {
            AuthService = _AuthService_;
            ToastService = _ToastService_;
            UserMock = _UserMock_;
            scope = _$rootScope_.$new();

            createController = function () {
                return $controller('LoginController', {
                    $scope: scope,
                    AuthService: AuthService,
                    ToastService: ToastService
                });
            };
        }));

        describe('showActionToast deve', function () {
            it('invocar o actionToast com a mensagem passada', function () {
                var toastStub = sinon.stub(ToastService, 'showActionToast', function(mensagem){});
                var controller = createController();
                var mensagem = {
                    textContent: "Mensagem de teste lel",
                    action: 'OK',
                    hideDelay: 5000
                };

                controller.showActionToast(mensagem.textContent);

                expect(toastStub.called).to.be.true;
                expect(toastStub.calledWith(mensagem)).to.be.true;
            });
        });

        // TODO : HomeToolbarTest @auhtor Estácio Pereira 14/01/2017
        // describe('signIn should', function () {
        //     it('show the Auth lock', function () {
        //         var controller = createController();
        //         var lockShowStub = sinon.stub(controller.lock, 'show', function () {
        //         });
        //         controller.signIn();
        //         // 'lockShowStub.should.not.have.been.called' passed!?
        //         expect(lockShowStub.called).to.be.ok;
        //     });
        // });
        //
        // describe('logout should', function () {
        //     it('signout and go home', function () {
        //         var logoutStub = sinon.stub(AuthService, 'logout');
        //         var controller = createController();
        //
        //         controller.$state = self.$state;
        //         self.$state.expectTransitionTo('home');
        //         controller.logout();
        //         expect(logoutStub.called).to.be.true;
        //     });
        // });
    });
})();
