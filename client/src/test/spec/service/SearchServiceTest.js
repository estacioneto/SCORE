(function () {
    'use strict';

    /**
     * Tests the SearchService. Checks if it's behaviour is correct.
     *
     * @author Estácio Pereira
     */
    describe('SearchServiceTest', function () {

        beforeEach(module('pitonApp', 'stateMock', 'Mocks'));

        var SearchService, NoteMock;
        var self = this;

        beforeEach(inject(defaultInjections(self)));

        beforeEach(inject(function (_SearchService_) {
            SearchService = _SearchService_;
        }));

        describe('addParam should', function () {
            it('correctly add a search parameter to the service', function () {
                var attr = 'active',
                    value = true,
                    isConstraint = true;
                SearchService.addParam(attr, value, isConstraint);
                expect(SearchService.searchParams[attr]).to.not.be.empty;
                expect(SearchService.searchParams[attr].value).to.be.equal(value);
                expect(SearchService.searchParams[attr].isConstraint).to.be.equal(isConstraint);
            });

            it('add a constraint as false if no constraint is given', function () {
                var attr = 'active',
                    value = true;
                SearchService.addParam(attr, value);
                expect(SearchService.searchParams[attr]).to.not.be.empty;
                expect(SearchService.searchParams[attr].value).to.be.equal(value);
                expect(SearchService.searchParams[attr].isConstraint).to.be.false;
            });
        });

        describe('deleteParam should', function () {
            it('correctly delete a search parameter of the service', function () {
                var attr = 'active',
                    value = true,
                    isConstraint = true;
                SearchService.addParam(attr, value, isConstraint);
                expect(SearchService.searchParams[attr]).to.not.be.empty;
                SearchService.deleteParam(attr);
                expect(SearchService.searchParams[attr]).to.be.undefined;
            });

            it('do nothing if there is no search parameters', function(){
                var attr = 'tags';
                expect(SearchService.searchParams[attr]).to.be.undefined;
                SearchService.deleteParam(attr);
                expect(SearchService.searchParams[attr]).to.be.undefined;
            });
        });
    });
})();
