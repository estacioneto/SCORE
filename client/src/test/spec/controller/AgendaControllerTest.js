(function () {
    'use strict';

    describe('AgendaControllerTest', function () {

        beforeEach(module('scoreApp', 'Mocks', 'stateMock'));
        var self = this;
        const ID_LOCAL_TEST = 1;

        let createController, scope, config, LocaisMock,
            AuthService, dependenciasController, $mdDialog;

        beforeEach(inject(defaultInjections(self)));

        beforeEach(inject(function ($injector, $controller, uiCalendarConfig, _LocaisMock_, _AuthService_) {

            $mdDialog = $injector.get('$mdDialog');
            scope = self.$rootScope.$new();
            config = uiCalendarConfig;
            LocaisMock = _LocaisMock_;
            AuthService = _AuthService_;

            config.calendars = {
                calendario: {
                   fullCalendar: function () {
                       return {type: 'agendaDay'};
                   }
                }
            };

            dependenciasController = {
                $scope: scope,
                local: _.first(LocaisMock.getLocais({_id: ID_LOCAL_TEST})),
                uiCalendarConfig: config,
                AuthService: AuthService
            };

            createController = function () {
                return $controller('AgendaController as agendaCtrl',dependenciasController);
            };
        }));

        describe('clickDia deve', function () {

            let modalAberto, controller;

            beforeEach(inject(function () {
                modalAberto = false;
                controller = createController();
                self.$httpBackend.expectGET(`/api/locais/${ID_LOCAL_TEST}/reservas`).respond({});
                scope.$digest();

                AuthService.userTemPermissao = sinon.stub().returns(true);
                sinon.stub($mdDialog, 'show').callsFake(function () {
                    modalAberto = true;
                });
            }));

           it('Não permitir criação de reservas em horários passados', function () {
               var dataPassada = new Date();
               dataPassada.setFullYear(1980);
               dataPassada.setMonth(10);
               dataPassada.setDate(15);

               controller.clickDia(dataPassada);
               expect(modalAberto).to.be.false;
           });

            it('Permitir criação de reservas em horários futuros', function () {
                var dataFutura = new Date(Date.now());
                dataFutura.setMonth(dataFutura.getMonth() + 1);

                controller.clickDia(dataFutura);
                expect(modalAberto).to.be.true;
            });

        });

    });
})();
