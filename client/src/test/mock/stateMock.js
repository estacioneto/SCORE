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
                    this.error = ("Transicao esperada para o estado: " + expectedState + " mas aconteceu para " + stateName);
                    return;
                }
            } else {
                this.error = ("Nao eram esperadas mais transicoes! Tentativa de transicao para " + stateName);
                return;
            }
            console.log("Transicao mock para: " + stateName);
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
                throw Error("Nem todas as transicoes aconteceram! Transicoes esperadas nao cumpridas : " + this.expectedTransitions);
            }
        }
    });
})();
