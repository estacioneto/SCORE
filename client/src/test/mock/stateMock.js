(function () {
    'use strict';
    // http://gist.github.com/wilsonwc/8358542/
    angular.module('stateMock', ['ui.router']);
    angular.module('stateMock').config(['$provide', function ($provide) {

        $provide.decorator('$state', ['$q', function ($q) {
            const stateMock = {};

            stateMock.expectedTransitions = [];
            stateMock.error;
            stateMock.current = 'app.teste';
            stateMock.transitionTo = function (stateName) {
                if (stateMock.expectedTransitions.length > 0) {
                    var expectedState = stateMock.expectedTransitions.shift();
                    if (expectedState !== stateName) {
                        stateMock.error = ("Expected transition to state: " + expectedState + " but transitioned to " + stateName );
                        return;
                    }
                } else {
                    stateMock.error = ("No more transitions were expected! Tried to transition to " + stateName );
                    return;
                }
                console.log("Mock transition to: " + stateName);
                return $q.when();
            };

            stateMock.href = function () {
                return '/teste';
            };

            stateMock.reload = function () {
            };

            stateMock.go = stateMock.transitionTo;

            stateMock.expectTransitionTo = function (stateName) {
                stateMock.expectedTransitions.push(stateName);
            };

            stateMock.getError = function () {
                return stateMock.error;
            };

            stateMock.ensureAllTransitionsHappened = function () {
                if (stateMock.expectedTransitions.length > 0) {
                    throw Error("Not all transitions happened! Unfulfilled expected transitions : " + stateMock.expectedTransitions);
                }
            };

            return stateMock;
        }]);
    }]);

})();