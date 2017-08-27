(function () {
    'use strict';

    describe('AgendaControllerTest', function () {

        beforeEach(module('scoreApp', 'Mocks', 'stateMock'));
        var self = this;

        let createController, scope, config, LocaisMock, compile,
            AuthService, calendarioConfig, eventos, dependenciasController, $mdDialog;

        beforeEach(inject(defaultInjections(self)));

        beforeEach(inject(function ($injector, _$compile_, _$rootScope_, $controller, uiCalendarConfig, _LocaisMock_, _AuthService_) {

            $mdDialog = $injector.get('$mdDialog');
            scope = _$rootScope_.$new();
            compile = _$compile_;
            config = uiCalendarConfig;
            LocaisMock = _LocaisMock_;
            AuthService = _AuthService_;

            dependenciasController = {
                $scope: scope,
                local: _.first(LocaisMock.getLocais()),
                uiCalendarConfig: config,
                AuthService: AuthService
            };

            calendarioConfig = {
                calendar:{
                    height: 200,
                    weekends: false,
                    defaultView: 'month'
                }
            };

            eventos = [[{title: 'Evento Teste', start: new Date(Date.now())}]];
            createController = function () {
                return $controller('AgendaController as agendaCtrl',dependenciasController, {
                        calendarioConfig: calendarioConfig,
                        eventosTeste: eventos},
                    );
            };
        }));

        describe('clickDia deve', function () {

            let modalAberto;
            let controller, elemento, elementoScope;

            beforeEach(inject(function () {
                modalAberto = false;
                self.$httpBackend.expectGET().respond({});
                controller = createController();
                elemento = compile('<div ui-calendar="{{agendaCtrl.calendarioConfig.calendar}}" calendar="calendario" ng-model="agendaCtrl.eventosTeste"></div>')(scope);
                scope.$apply();
                elementoScope = elemento.scope();
                elementoScope.$digest();

                sinon.stub($mdDialog, 'show').callsFake(function () {
                    modalAberto = true;
                });
                sinon.stub(AuthService, 'userTemPermissao').callsFake(function () {
                    return true;
                });
                sinon.stub(config.calendars.calendario, 'fullCalendar').callsFake(function () {
                    return {type: 'agendaDay'};
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
