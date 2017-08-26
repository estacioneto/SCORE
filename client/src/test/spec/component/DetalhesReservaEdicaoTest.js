(() => {
    'use strict';

    describe('DetalhesReservaEdicaoTest', () => {

        beforeEach(module('scoreApp', 'Mocks', 'stateMock'));

        const NOME_COMPONENTE = 'detalhesReservaEdicao';

        let $componentController, $scope, ReservasMock, LocaisMock, ModalService;
        let createController, injecoesController;
        const self = this;

        beforeEach(inject(defaultInjections(self)));

        beforeEach(inject(function (_$rootScope_, _$componentController_, _ReservasMock_, _LocaisMock_, _ModalService_) {
            $scope = _$rootScope_.$new();
            $componentController = _$componentController_;
            ReservasMock = _ReservasMock_;
            LocaisMock = _LocaisMock_;
            ModalService = _ModalService_;

            injecoesController = {
                ModalService
            };

            createController = function () {
                return $componentController(NOME_COMPONENTE, injecoesController, {
                    local: _.first(LocaisMock.getLocais()),
                    reserva: ReservasMock.getReserva()
                });
            };
        }));

        describe('DetalhesReservaEdicao isCriacao deve', () => {
            let controller;
            beforeEach(() => {
                controller = createController();
            });

            it('retornar true caso a reserva não possua id', () => {
                controller.reserva._id = undefined;
                expect(controller.isCriacao()).to.be.true;
            });

            it('retornar false caso a reserva possua id', () => {
                controller.reserva._id = 'id';
                expect(controller.isCriacao()).to.be.false;
            });
        });

        describe('DetalhesReservaEdicao verTermos deve', () => {
            let controller;
            beforeEach(() => {
                controller = createController();
            });

            it('chamar função em ModalService para abrir modal de termos do local', () => {
                ModalService.verTermosLocal = sinon.stub();
                const $event = {};

                controller.verTermos($event);
                sinon.assert.calledWith(ModalService.verTermosLocal, controller.local, false, $event);
            });
        });
    });
})();
