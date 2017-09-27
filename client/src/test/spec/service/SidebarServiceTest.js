(() => {
    'use strict';

    describe('SidebarServiceTest', () => {

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

        let $scope, $mdSidenav, SidebarService;
        beforeEach(inject(function (_$mdSidenav_, _SidebarService_) {
            $scope = self.$rootScope.$new();
            $mdSidenav = _$mdSidenav_;
            SidebarService = _SidebarService_;
        }));

        afterEach(() => {
            sandbox.verifyAndRestore();
        });

        describe('SidebarService toggle deve', () => {
            it('fechar a barra se ela estiver aberta', () => {
                $mdSidenav().isOpen.returns(true);
                SidebarService.toggle();

                sandbox.assert.calledWith($mdSidenav, SidebarService.SIDEBAR_PRINCIPAL);
                sandbox.assert.calledOnce($mdSidenav().isOpen);
                sandbox.assert.calledOnce($mdSidenav().close);
                sandbox.assert.notCalled($mdSidenav().toggle);
            });

            it('chamar função toggle se ela não estiver aberta', () => {
                $mdSidenav().isOpen.returns(false);
                SidebarService.toggle();

                sandbox.assert.calledWith($mdSidenav, SidebarService.SIDEBAR_PRINCIPAL);
                sandbox.assert.calledOnce($mdSidenav().isOpen);
                sandbox.assert.notCalled($mdSidenav().close);
                sandbox.assert.calledOnce($mdSidenav().toggle);
            });
        });
    });
})();