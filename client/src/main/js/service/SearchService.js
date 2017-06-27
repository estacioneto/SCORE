(function () {
    'use strict';

    var searchModule = angular.module('buscaModulo', []);

    /**
     * This Service deals with the Search deep logic.
     *
     * @author Estácio Pereira, Eric Breno
     */
    searchModule.service('SearchService', [function () {
        var self = this;
        this.searchParams = {};

        /**
         * Adds a parameter to the search.
         *
         * @param {String}  attr         Attribute to be added on validation.
         * @param {*}       value        The value to validate the attribute.
         * @param {boolean} isConstraint Indicates if the added attribute is a constraint or not.
         */
        this.addParam = function (attr, value, isConstraint) {
            self.searchParams[attr] = {
                value: value,
                isConstraint: !!isConstraint // In case of undefined.
            };
        };

        /**
         * Deletes a parameter.
         *
         * @param {String} attr Parameter's name.
         */
        this.deleteParam = function (attr) {
            delete self.searchParams[attr];
        };

        /**
         * Filters a given list of notes according to the current search parameters and
         * the given input (important to filter the title, content...).
         *
         * @param   {Array}  notes Notes to be filtered.
         * @param   {String} input Value of the input box.
         * @returns {Array} The filtered notes.
         */
        this.filter = function (notes, input) {
            var param = angular.copy(self.searchParams);
            setInputParams(param, input);

            var constraintParams = {};
            var atLeastOneParams = {};

            _.each(param, function (value, attr) {
                if (value.isConstraint) {
                    constraintParams[attr] = value;
                } else {
                    atLeastOneParams[attr] = value;
                }
            });

            var filteredNotes = [];
            _.each(notes, function (note, index) {
                if (validateAtLeastOneParam(note, atLeastOneParams) &&
                    validateConstraintParams(note, constraintParams)) {
                    filteredNotes.push(note);
                }
            });
            return filteredNotes;
        };

        /**
         * Validates a note according the constraint parameters. The note is valid
         * if it has all the constraints valid.
         *
         * @param   {Note}    note   The note to be validated.
         * @param   {Array}   params Constraint parameters.
         * @returns {boolean} true if the note is valid, false otherwise.
         */
        function validateConstraintParams(note, params) {
            var isValid = true;
            _.each(params, function (value, attr) {
                isValid = isValid && isFilterValid(note, attr, value.value);
            });
            return isValid;
        }

        /**
         * Validates a note according the 'non-constraint' parameters. The note is valid
         * if it has at least one of the parameter validated.
         *
         * @param   {Note}    note   The note to be validated.
         * @param   {Array}   params Constraint parameters.
         * @returns {boolean} true if the note is valid, false otherwise.
         */
        function validateAtLeastOneParam(note, params) {
            var isValid = false;
            _.each(params, function (value, attr) {
                isValid = isValid || isFilterValid(note, attr, value.value);
            });
            return isValid;
        }

        /**
         * Set the input parameters. They are not constraints. If the given string
         * is a substring of one of the added parameters, the note is valid.
         *
         * @param {Object} param The object encapsulating the parameters to be analyzed.
         * @param {String} input The user's input.
         */
        function setInputParams(param, input) {
            input = input || '';
            param.title = {
                value: input,
                isConstraint: false
            };
            param.textContent = {
                value: input,
                isConstraint: false
            };
        }

        /**
         * Filters a note to determinate if it's valid according to the params.
         *
         * @param   {Note}             note  The note to be analyzed.
         * @param   {String | Array}   attrs  Attribute of the note to be validated.
         * @param   {String | boolean} value Value to the attribute be valid.
         * @returns {boolean} true if the note is valid according the value.
         */
        function isFilterValid(note, attrs, value) {
            var noteAttr = note;
            attrs = attrs.split('.');
            _.each(attrs, function (attr, index) {
                noteAttr = noteAttr[attr];
            });

            var isValid = checkContainsString(noteAttr, value);
            if (!isValid && _.first(attrs) === 'tags') {
                noteAttr.forEach(function (tag) {
                    isValid = isValid || checkContainsString(tag, value);
                });
            }
            return isValid;
        }


        /**
         * Verifies if two string are equals or the first contains the second.
         */
        function checkContainsString(mainStr, otherStr) {
            if (_.isString(mainStr)) {
                mainStr = mainStr.toLowerCase();
            }
            if (_.isString(otherStr)) {
                otherStr = otherStr.toLowerCase();
            }
            return mainStr === otherStr || _.includes(mainStr, otherStr); // || _.includes(otherStr, mainStr);
        }
    }]);
})();
