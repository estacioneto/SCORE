function defaultInjections(self) {
    return function (_$httpBackend_, _$q_, _$rootScope_, _$state_) {
        self.$httpBackend = _$httpBackend_;
        self.$q = _$q_;
        self.$rootScope = _$rootScope_;
        self.$state = _$state_;
        self.modalInstanceMock = { close: function () { }, dismiss: function () { } };
    };
}

function defaultAfterEach(self){
    return function () {
        self.$httpBackend.verifyNoOutstandingExpectation();
        self.$httpBackend.verifyNoOutstandingRequest();
        if (self.$state.getError() !== undefined) {
            throw Error(self.$state.getError());
        }
        self.$state.ensureAllTransitionsHappened();
        self.$httpBackend.resetExpectations();
    }
}