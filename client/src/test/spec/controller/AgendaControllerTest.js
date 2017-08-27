(function () {
    'use strict';

    describe('AgendaControllerTest', function () {

        beforeEach(module('scoreApp', 'Mocks', 'stateMock'));
        var self = this;
        const ID_LOCAL_TEST = 1;

        let createController, scope, config, LocaisMock, ReservasMock,
            AuthService, dependenciasController, $mdDialog;

        beforeEach(inject(defaultInjections(self)));
        afterEach(defaultAfterEach(self));

        beforeEach(inject(function ($injector, $controller, uiCalendarConfig, _LocaisMock_, _AuthService_, _ReservasMock_) {

            $mdDialog = $injector.get('$mdDialog');
            scope = self.$rootScope.$new();
            config = uiCalendarConfig;
            LocaisMock = _LocaisMock_;
            AuthService = _AuthService_;
            ReservasMock = _ReservasMock_;

            config.calendars = {
                calendario: {
                   fullCalendar: function () {
                       return {type: 'agendaDay'};
                   }
                }
            };

            dependenciasController = {
                $scope: scope,
                local: LocaisMock.getLocal({_id: ID_LOCAL_TEST}),
                uiCalendarConfig: config,
                AuthService: AuthService
            };

            createController = function () {
                self.$httpBackend.expectGET(`/api/locais/${ID_LOCAL_TEST}/reservas`).respond([ReservasMock.getReserva()]);
                const controller = $controller('AgendaController as agendaCtrl',dependenciasController);
                self.$httpBackend.flush();

                return controller;
            };
        }));

        describe('calendarioConfig deve', function () {
            let controller;
            beforeEach(() => {
                controller = createController();
            });

            it('ter propriedade calendario.ignoreTimezone como false', () => {
                expect(controller.calendarioConfig.calendario.ignoreTimezone).to.be.false;
            });

            it('ter propriedade calendario.timezone como "local"', () => {
                expect(controller.calendarioConfig.calendario.timezone).to.be.eql('local');
            });
        });

        describe('clickDia deve', function () {

            let controller;

            beforeEach(inject(function () {
                controller = createController();

                AuthService.userTemPermissao = sinon.stub().returns(true);
                $mdDialog.show = sinon.stub();
            }));

           it('Não permitir criação de reservas em horários passados', function () {
               var dataPassada = new Date();
               dataPassada.setFullYear(1980);
               dataPassada.setMonth(10);
               dataPassada.setDate(15);

               controller.clickDia(moment(dataPassada));
               sinon.assert.notCalled($mdDialog.show);
           });

            it('Permitir criação de reservas em horários futuros', function () {
                var dataFutura = new Date(Date.now());
                dataFutura.setMonth(dataFutura.getMonth() + 1);

                controller.clickDia(moment(dataFutura));
                sinon.assert.called($mdDialog.show);
            });

        });

    });
})();
