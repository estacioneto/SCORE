(function () {
    'use strict';

    /**
     * Teste de SearchService. Checa se seu comportamento eh correto.
     *
     * @author Estácio Pereira
     */
    describe('SearchServiceTest', function () {

        beforeEach(module('scoreApp', 'stateMock', 'Mocks'));

        var SearchService, NoteMock;
        var self = this;

        beforeEach(inject(defaultInjections(self)));

        beforeEach(inject(function (_SearchService_) {
            SearchService = _SearchService_;
        }));

        describe('deve addParam', function () {
            it('adicionar corretamente um parametro de pesquisa para o servico', function () {
                var attr = 'active',
                    value = true,
                    isConstraint = true;
                SearchService.addParam(attr, value, isConstraint);
                expect(SearchService.searchParams[attr]).to.not.be.empty;
                expect(SearchService.searchParams[attr].value).to.be.equal(value);
                expect(SearchService.searchParams[attr].isConstraint).to.be.equal(isConstraint);
            });

            it('adicionar uma restricao como false se nao foi dado alguma restricao', function () {
                var attr = 'active',
                    value = true;
                SearchService.addParam(attr, value);
                expect(SearchService.searchParams[attr]).to.not.be.empty;
                expect(SearchService.searchParams[attr].value).to.be.equal(value);
                expect(SearchService.searchParams[attr].isConstraint).to.be.false;
            });
        });

        describe('deve deleteParam', function () {
            it('deletar corretamente um parametro de pesquisa do servico', function () {
                var attr = 'active',
                    value = true,
                    isConstraint = true;
                SearchService.addParam(attr, value, isConstraint);
                expect(SearchService.searchParams[attr]).to.not.be.empty;
                SearchService.deleteParam(attr);
                expect(SearchService.searchParams[attr]).to.be.undefined;
            });

            it('nao realizar acao alguma se nao tem parametros de pesquisa', function(){
                var attr = 'tags';
                expect(SearchService.searchParams[attr]).to.be.undefined;
                SearchService.deleteParam(attr);
                expect(SearchService.searchParams[attr]).to.be.undefined;
            });
        });
    });
})();
