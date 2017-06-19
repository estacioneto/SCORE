(function () {
    'use strict';

    var userModule = angular.module('userModule', []);

    /**
     * The user's factory. It builds the User object that will encapsulate all the user's
     * properties and functions, including the Auth0 ones.
     */
    userModule.factory('User', [function () {
        var metadata = ['given_name', 'family_name'];

        /**
         * The factory's constructor. Given an user, it builds the object.
         *
         * @param {String} user User to become an User object.
         * @constructor
         */
        function User(user) {
            this.getProperties(user);
            this.organizeMetadata();
            this.name = this.given_name + ' ' + this.family_name;
        }

        /**
         * Get the properties from the given user.
         *
         * @param {Object} user Object to have properties copied.
         */
        User.prototype.getProperties = function (user) {
            var self = this;
            _.each(user, function (value, prop) {
                self[prop] = value;
            });
        };

        /**
         * Define the getters and setters from the user's metadata.
         */
        User.prototype.organizeMetadata = function () {
            var self = this;
            _.each(metadata, function (prop) {
                self[prop] = self[prop] || self.user_metadata[prop];
            });
        };

        User.prototype.constructor = User;

        return User;
    }]);
}());