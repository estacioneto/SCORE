(function () {
    'use strict';

    describe('CalendarioControllerTest', function () {

        beforeEach(module('scoreApp', 'stateMock'));

        var createController, scope, state;
        var self = this;

        beforeEach(inject(defaultInjections(self)));

        beforeEach(inject(function (_$rootScope_, $controller, $state) {

            scope = _$rootScope_.$new();
            state = $state;
            sinon.spy(state, "go");

            createController = function () {
                return $controller('CalendarioController', {
                    $scope: scope
                });
            };
        }));

        describe.skip('deve clickDia', function () {
            it('abrir pagina das reservas referentes a aquele dia', function () {
                var controller = createController();
                var date = new Date();
                date.setFullYear(1980);
                date.setDate(15);
                date.setMonth(3);

                controller.clickDia(date);

                assert(state.go.calledOnce);
                expect(state.go.calledWith("app.dia", {
                    numeroDia: 15,
                    numeroMes: 3,
                    ano: 1980
                })).to.be.true;

            });
        });
    });
})();
