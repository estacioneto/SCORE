(function () {
    'use strict';
    // http://gist.github.com/wilsonwc/8358542/
    angular.module('stateMock', []);
    angular.module('stateMock').service("$state", function ($q) {
        this.expectedTransitions = [];
        this.error;
        this.transitionTo = function (stateName) {
            if (this.expectedTransitions.length > 0) {
                var expectedState = this.expectedTransitions.shift();
                if (expectedState !== stateName) {
                    this.error = ("Expected transition to state: " + expectedState + " but transitioned to " + stateName);
                    return;
                }
            } else {
                this.error = ("No more transitions were expected! Tried to transition to " + stateName);
                return;
            }
            console.log("Mock transition to: " + stateName);
            var deferred = $q.defer();
            var promise = deferred.promise;
            deferred.resolve();
            return promise;
        };
        this.go = this.transitionTo;
        this.expectTransitionTo = function (stateName) {
            this.expectedTransitions.push(stateName);
        };
        this.getError = function () {
            return this.error;
        };
        this.ensureAllTransitionsHappened = function () {
            if (this.expectedTransitions.length > 0) {
                throw Error("Not all transitions happened! Unfulfilled expected transitions : " + this.expectedTransitions);
            }
        }
    });
})();
