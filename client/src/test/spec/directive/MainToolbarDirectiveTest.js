(() => {
    'use strict';

    describe('MainToolbarDirectiveTest', () => {

        beforeEach(module('stateMock', 'scoreApp'));

        beforeEach(module(function ($provide) {
            $provide.service('$mdSidenav', function () {
                this.isOpen = sinon.stub();
                this.close = sinon.stub();
                this.toggle = sinon.stub();
                return sinon.stub().returns(this);
            });
        }));

        const self = this;

        beforeEach(inject(defaultInjections(self)));

        let $scope, compile, element, $mdSidenav;
        const MAIN_SIDENAV = 'main-sidenav';
        beforeEach(inject(function ($compile, $templateCache, _$mdSidenav_) {
            $scope = self.$rootScope.$new();
            compile = $compile;
            $mdSidenav = _$mdSidenav_;

            const toolbarHtml = $templateCache.get("src/main/view/mainToolbar.html");
            $templateCache.put("./view/mainToolbar.html", toolbarHtml);

            element = angular.element(
                `<main-toolbar></main-toolbar>`
            );
            element = $compile(element)($scope);

            $scope.$digest();
        }));

        describe('MainToolbarDirective toggleBarraLateral deve', () => {
            it('fechar a barra se ela estiver aberta', () => {
                const diretiva = element.isolateScope();
                $mdSidenav().isOpen.returns(true);
                diretiva.toggleBarraLateral();

                sinon.assert.calledWith($mdSidenav, MAIN_SIDENAV);
                sinon.assert.calledOnce($mdSidenav().isOpen);
                sinon.assert.calledOnce($mdSidenav().close);
                sinon.assert.notCalled($mdSidenav().toggle);
            });

            it('chamar função toggle se ela não estiver aberta', () => {
                const diretiva = element.isolateScope();
                $mdSidenav().isOpen.returns(false);
                diretiva.toggleBarraLateral();

                sinon.assert.calledWith($mdSidenav, MAIN_SIDENAV);
                sinon.assert.calledOnce($mdSidenav().isOpen);
                sinon.assert.notCalled($mdSidenav().close);
                sinon.assert.calledOnce($mdSidenav().toggle);
            });
        });

        // TODO: sair, entrar, getNomeDoEstadoAtual, getNomeState, irParaInicio, main/init
    });
})();