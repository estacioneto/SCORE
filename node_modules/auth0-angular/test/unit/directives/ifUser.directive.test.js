describe('if user: ', function () {
    var $rootScope, $compile, dElement;

    beforeEach(function () {
        module('auth0.directives');
        inject(function (_$rootScope_, _$compile_) {
            $rootScope = _$rootScope_;
            $compile = _$compile_;
        });
        

        dElement = angular.element('<div if-user>HI</div>');
        var compiledElement = $compile(dElement)($rootScope);
        compiledElement.scope().$apply();
    });

    it('should not be hidden if user', function () {
        $rootScope.isAuthenticated = true;
        $rootScope.$digest();
        var isHidden = dElement.hasClass('ng-hide');
        expect(isHidden).to.be.false;
    });

    it('should be hidden if NOT user', function () {
        $rootScope.isAuthenticated = false;
        $rootScope.$digest();
        var isHidden = dElement.hasClass('ng-hide');
        expect(isHidden).to.be.true;
    });
});