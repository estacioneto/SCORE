/*
*
* Utility service to assist with:
 * 1. Capitalization
 * 2. Retrieve function name
 * 3. Angular's $rootScope.$apply
 * 4. Creates an 'applied' callback
 * 5. Convert callbacks to promises
 *
 * */

    angular.module('auth0.utils', [])
        .provider('authUtils', function() {
            var Utils = {
                /*
                *
                * DESCRIPTION: Capitalize strings
                * INPUT: string
                * OUTPUT: string
                *
                * */
                capitalize: function(string) {
                    return string ? string.charAt(0).toUpperCase() + string.substring(1).toLowerCase() : null;
                },

                /*
                 *
                 * DESCRIPTION: Retrieve the name of a supplied function
                 * INPUT: function
                 * OUTPUT: string
                 *
                 * */
                fnName : function(fun) {
                    var ret = fun.toString();
                    ret = ret.substr('function '.length);
                    ret = ret.substr(0, ret.indexOf('('));
                    return ret ? ret.trim() : ret;
                }
            };

            angular.extend(this, Utils);

            this.$get = ['$rootScope', '$q', function($rootScope, $q) {
                var authUtils = {};
                angular.extend(authUtils, Utils);

                /*
                 *
                 * DESCRIPTION: Checks if Angular is in the $apply or $digest phase
                 * before calling $rootScope.$apply on a fn passed to it
                 *
                 * INPUT: function
                 *
                 * */

                authUtils.safeApply = function(fn) {
                    var phase = $rootScope.$root.$$phase;
                    if(phase === '$apply' || phase === '$digest') {
                        if(fn && (typeof(fn) === 'function')) {
                            fn();
                        }
                    } else {
                        $rootScope.$apply(fn);
                    }
                };

                /*
                 *
                 * DESCRIPTION: Creates an 'applied callback using Angular's $apply()
                 * INPUT: function
                 * OUTPUT: function
                 *
                 * */

                authUtils.callbackify = function (nodeback, success, error, self) {
                    if (angular.isFunction(nodeback)) {
                        return function (args) {
                            args = Array.prototype.slice.call(arguments);
                            var callback = function (err, response, etc) {
                                if (err) {
                                    error && error(err);
                                    return;
                                }
                                // if more arguments then turn into an array for .spread()
                                etc = Array.prototype.slice.call(arguments, 1);
                                success && success.apply(null, etc);
                            };
                            if (success || error) {
                                args.push( (!success) ? authUtils.errorHandler(callback) : authUtils.applied(callback) );
                            }
                            nodeback.apply(self, args);
                        };
                    }
                };

                /*
                 *
                 * DESCRIPTION: Creates a promise from where a callback is expected
                 * INPUT: function
                 * OUTPUT: function
                 *
                 * */

                authUtils.promisify = function (nodeback, self) {
                    if (angular.isFunction(nodeback)) {
                        return function (args) {
                            args = Array.prototype.slice.call(arguments);
                            var dfd = $q.defer();
                            var callback = function (err, response, etc) {
                                if (err) {
                                    dfd.reject(err);
                                    return;
                                }
                                // if more arguments then turn into an array for .spread()
                                etc = Array.prototype.slice.call(arguments, 1);
                                dfd.resolve(etc.length > 1 ? etc : response);
                            };

                            args.push(authUtils.applied(callback));
                            nodeback.apply(self, args);
                            // spread polyfill only for promisify
                            dfd.promise.spread = dfd.promise.spread || function (fulfilled, rejected) {
                                    return dfd.promise.then(function (array) {
                                        return Array.isArray(array) ? fulfilled.apply(null, array) : fulfilled(array);
                                    }, rejected);
                                };
                            return dfd.promise;
                        };
                    }
                };

                /*
                 *
                 * DESCRIPTION: Uses safeApply() on a callback after passing in the callback arguments
                 * INPUT: function
                 * OUTPUT: function
                 *
                 * */

                authUtils.applied = function(fn) {
                    // Adding arguments just due to a bug in Auth0.js.
                    return function (err, response) {
                        // Using variables so that they don't get deleted by UglifyJS
                        err = err;
                        response = response;
                        var argsCall = arguments;
                        authUtils.safeApply(function() {
                            fn.apply(null, argsCall);
                        });
                    };
                };

                /*
                 *
                 * DESCRIPTION: Uses safeApply() on a callback after passing in the callback arguments
                 * INPUT: function
                 * OUTPUT: function
                 *
                 * */
                
                authUtils.errorHandler = function(fn) {
                  return function () {
                    var args = Array.prototype.slice.call(arguments);
                    if (args[0] !== null) {
                      authUtils.safeApply(function () {
                        fn.apply(null, args);
                      });
                    }
                  };
                };
                

                return authUtils;
            }];



        });
