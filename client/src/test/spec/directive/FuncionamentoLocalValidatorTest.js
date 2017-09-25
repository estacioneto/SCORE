(() => {
    'use strict';

    describe('FuncionamentoLocalValidatorTest', () => {

        beforeEach(module('stateMock', 'scoreApp'));

        const self = this;
        beforeEach(inject(defaultInjections(self)));

        let $scope, compile, element, valor, form;
        beforeEach(inject(function ($compile) {
            $scope = self.$rootScope.$new();
            compile = $compile;

            valor = 10001200;
            element = angular.element(
                `<form name="form">
                    <input name="funcionamento"
                        funcionamento-local-validator 
                        ng-model="model.valor"/>
                </form>`);
            $scope.model = {valor};
            element = $compile(element)($scope);
            form = $scope.form;
        }));

        describe('$validators.funcionamentoLocal deve', () => {
            it('retornar true caso o intervalo seja válido', () => {
                valor = 10001200;
                form.funcionamento.$setViewValue(valor);
                $scope.$digest();
                expect(form.funcionamento.$valid).to.be.true;
            });

            it('retornar true caso o intervalo seja inválido', () => {
                valor = 13001200;
                form.funcionamento.$setViewValue(valor);
                $scope.$digest();
                expect(form.funcionamento.$valid).to.be.false;
            });
        });
    });
})();