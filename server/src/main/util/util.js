(function () {
    'use strict';

    /**
     * Oh yes... We add some interesting things to lodash and use it as an util module.
     */
    let _ = require('lodash');
    
    _.BAD_REQUEST = 400;
    _.UNAUTHORIZED = 401;
    _.OK = 200;
    _.CREATED = 201;

    _.FIRST_INDEX = 0;
    _.INVALID_INDEX = -1;

    _.auth0 = 'https://estacioneto.auth0.com';
    _.loginEndpoint = '/oauth/ro';
    _.tokeninfo = '/tokeninfo';

    _.RANDOM_STRING_LENGTH = 1000;

    /**
     * Given two objects (the target should be a mongoose object), soft copies the properties from one
     * object to another.
     *
     * @param {Object} toObject   Mongoose object that will have new properties
     * @param {Object} fromObject Object to have properties copied
     */
    _.updateModel = (toObject, fromObject) => {
        _.each(fromObject, (value, key) => {
            // _id, __v...
            if (_.contains(key, '_')) return;

            // http://stackoverflow.com/questions/15092912/dynamically-updating-a-javascript-object-from-a-string-path
            let keys = key.split('.');
            _.set(toObject, keys, value);
            // https://github.com/Automattic/mongoose/issues/1204
            toObject.markModified(_.first(keys));
        });
    };

    /**
     * Once I tried to use some ways to compare mongoose objects and didn't work. So,
     * in this function, I compare then by the id.
     *
     * @param {Array}  arr            Array to have the object searched.
     * @param {Object} mongooseObject Object to be searched.
     */
    _.containsMongoose = (arr, mongooseObject) =>
        !_.isEmpty(_.filter(arr, obj => JSON.stringify(obj._id) === JSON.stringify(mongooseObject._id)));

    /**
     * Once I tried to use the underscore contains function. Didn't work.
     * This one should do the same thing. Well... Should...
     *
     * @param {Array}  arr    Array to have the object searched.
     * @param {Object} object Object to be searched.
     */
    _.contains = (arr, object) => arr.indexOf(object) !== _.INVALID_INDEX;

    /**
     * Given the request, this function returns the authorization token present on headers.
     *
     * @param   {Object} req The request.
     * @returns {string} The token on headers.
     */
    _.getToken = req => req.header('id_token') || _.getAuthorizationToken(req);

    /**
     * Returns the token present at the authorization header property.
     *
     * @param   {Object} req The request.
     * @returns {String} The authorization token.
     */
    _.getAuthorizationToken = (req) => {
        let authHeader = req.header('Authorization');
        return authHeader.substring(authHeader.indexOf(' ')).trim();
    };
    /**
     * Generates a new String (pretty small probability of same String), given it's size.
     *
     * @param   {Number} size Length of the random String.
     * @returns {string} Random string with the given length
     */
    _.generateNewString = size => {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        for (let i = 0; i < size; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };

    /**
     * Handles the validation error from mongoose.
     *
     * @param   {Object}   err  Mongoose error object.
     * @param   {Function} next Callback function to redirect to the next function.
     */
    _.handleValidationError = (err, next) => {
        let message = err.message + ': ';
        _.each(err.errors, (value, field) => {
            if (message.indexOf(': ') !== message.length - ': '.length)
                message += ' and ';
            message += value.message;
        });
        return next(new Error(message))
    };

    _.ONE_HOUR = 3600000;
    _.TEN_MINUTES = _.ONE_HOUR / 60;

    module.exports = _;
})();
