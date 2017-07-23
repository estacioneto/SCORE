(function () {
    'use strict';
    let _ = require('../util/util'),
        authService = require('./authService');

    /**
     * The usersService deals with the more complex user detail/logic. It's
     * responsible for anything related to caching the users too.
     * It is extremely useful to us to identify the logged user.
     *
     * @author Estácio Pereira.
     */
    let usersService = {
        cache: {},
        idCache: {}
    };

    /**
     * Gets an element from the cache. Required to control the more accessed
     * elements
     *
     * @param   {string} cache Name of the cache.
     * @param   {string} key   Key of the desired element.
     * @returns {String} Value in cache.
     */
    function getFromCache(cache, key) {
        usersService[cache][key].touched = Date.now();
        return usersService[cache][key].value;
    }

    /**
     * Puts an element on the cache.
     *
     * @param   {string} cache Name of the cache.
     * @param   {string} key   Key of the desired element.
     * @param   {Object} value Value to be put on cache.
     */
    function putOnCache(cache, key, value) {
        usersService[cache][key] = {
            value: value,
            touched: Date.now()
        };
    }

    /**
     * The elements that have not been accessed recently (one hour... yeah...)
     * will be deleted.
     *
     * @param {string} cache Name of the cache.
     */
    function clearCache(cache) {
        _.each(usersService[cache], function (element, key) {
            if (element.touched + _.TEN_MINUTES < Date.now()) delete usersService[cache][key];
        });
    }

    /**
     * Verifies if a given user is cached.
     *
     * @param   {Object}  user Requested user.
     * @returns {boolean} true if the user is cached, false otherwise.
     */
    usersService.isCached = user => _.some(usersService.cache, {value: JSON.stringify(user)});

    /**
     * Adds a user to cache.
     *
     * @param {String} token Token of the user.
     * @param {Object} user  User to be cached.
     */
    usersService.cacheUser = (token, user) => {
        if (!_.isEmpty(token) && !_.isEmpty(user)) {
            user = JSON.stringify(user);

            const tokenAntigo = _.findKey(usersService.cache, {value: user});
            if (tokenAntigo) {
                delete usersService.cache[tokenAntigo];
            }
            putOnCache('cache', token, user);
            putOnCache('idCache', user.user_id, JSON.parse(user));
        }
    };

    usersService.getUserById = (userId, callback) => {
        if (!_.isEmpty(usersService.idCache[userId])) {
            return callback(null, getFromCache('idCache', userId));
        }
        return authService.getUserById(userId, (err, result) => {
            if (err) return callback(err, null);
            putOnCache('idCache', userId, result);
            return callback(null, result);
        });
    };

    /**
     * Gets the user with the given token, if it exists (error, otherwise).
     * If the user is cached, we don't need to request Auth0.
     *
     * @param {String}   idToken  User's identification token.
     * @param {Function} callback Callback function called after the query.
     */
    usersService.getUser = (idToken, callback) => {
        if (usersService.cache[idToken]) {
            return callback(null, JSON.parse(getFromCache('cache', idToken)));
        }
        return authService.getUser(idToken, (err, result) => {
            if (!err) {
                usersService.cacheUser(idToken, result);
            }
            return callback(err, result);
        });
    };

    usersService.getLoggedUserTokenByEmail = email => {
        let index = 0;
        let tokens = Object.keys(usersService.cache);
        while (index < tokens.length) {
            let user = JSON.parse(usersService.cache[tokens[index]].value);
            if (user.email === email) return tokens[index];
        }
    };

    /**
     * Activates the cache cleaner.
     */
    (() => {
        setInterval(() => {
            clearCache('cache');
            clearCache('idCache');
        }, _.TEN_MINUTES);
    })();

    module.exports = usersService;
})();
