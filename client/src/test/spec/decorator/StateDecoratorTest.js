(() => {
    'use strict';

    /**
     * Testes relacionados ao decorator do Service self.$state.
     *
     * @author Estácio Pereira.
     */
    describe('stateDecoratorTest', () => {

        const self = this;

        beforeEach(module('stateMock', 'Mocks', 'scoreApp'));

        beforeEach(inject(defaultInjections(self)));
        afterEach(defaultAfterEach(self));

        let event, toState, toParams, fromState, fromParams, $transition;

        beforeEach(() => {
            self.$state.$stateStack = [];

            event = {};
            toState = {
                name: 'stateDestino'
            };
            toParams = {};
            fromState = {
                name: 'stateOrigem'
            };
            fromParams = {};

            $transition = {
                $from: sinon.stub().returns(fromState),
                params: sinon.stub().withArgs('from').returns(fromParams)
            }
        });

        describe('stateDecorator $$onTransitionSuccess deve', () => {
            it('adicionar o state anterior caso o mesmo seja válido', () => {
                expect(self.$state.$stateStack).to.be.empty;
                self.$state.$$onTransitionSuccess($transition);
                expect(self.$state.$stateStack).to.not.be.empty;
                expect(_.first(self.$state.$stateStack)).to.be.eql(fromState);
            });

            it('não adicionar o state anterior caso o mesmo seja o primeiro, ou seja, nome vazio', () => {
                expect(self.$state.$stateStack).to.be.empty;
                fromState.name = '';
                self.$state.$$onTransitionSuccess($transition);
                expect(self.$state.$stateStack).to.be.empty;
            });

            it('não adicionar o state anterior caso seja ação de voltar', () => {
                self.$state.$stateStack = [fromState];

                self.$state.expectTransitionTo(fromState.name);
                expect(self.$state.goBack()).to.be.true;
                expect(self.$state.$stateStack).to.be.empty;

                self.$state.$$onTransitionSuccess($transition);
                expect(self.$state.$stateStack).to.be.empty;

            });
        });

        describe('stateDecorator goBack deve', () => {
            it('redirecionar para o último state visitado, removê-lo da pilha e retornar true', () => {
                self.$state.$stateStack = [toState, fromState];

                self.$state.expectTransitionTo(fromState.name);
                expect(self.$state.goBack()).to.be.true;
                expect(self.$state.$stateStack).to.be.eql([toState]);
            });

            it('redirecionar ao state padrão caso a pilha de state esteja vazia', () => {
                self.$state.$stateStack = [];

                const statePadrao = {
                    name: 'statePadrao'
                };

                self.$state.expectTransitionTo(statePadrao.name);
                expect(self.$state.goBack(statePadrao.name)).to.be.true;
                expect(self.$state.$stateStack).to.be.empty;
            });

            it('não redirecionar e retornar false caso a pilha de state esteja vazia e não tenha sido passado state padrão', () => {
                self.$state.$stateStack = [];
                expect(self.$state.goBack()).to.be.false;
                expect(self.$state.$stateStack).to.be.empty;
            });
        });
    });
})();
