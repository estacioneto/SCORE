(function () {
    'use strict';

    var searchModule = angular.module('buscaModulo', []);

    /**
     * SearchService lida com a lógica de pesquisa aprofundada.
     *
     * @author Estácio Pereira, Eric Breno
     */
    searchModule.service('SearchService', [function () {
        var self = this;
        this.searchParams = {};

        /**
         * Adiciona um parâmetro a pesquisa.
         *
         * @param {String}  attr         O atributo a ser inserido em validação.
         * @param {*}       value        O valor para validar o atributo.
         * @param {boolean} isConstraint true, se o atributo adicionado é uma constraint, false, caso contrário.
         */
        this.addParam = function (attr, value, isConstraint) {
            self.searchParams[attr] = {
                value: value,
                isConstraint: !!isConstraint // Em caso de indefinido.
            };
        };

        /**
         * Deleta um parâmetro pelo nome.
         *
         * @param {String} attr O nome do parâmetro.
         */
        this.deleteParam = function (attr) {
            delete self.searchParams[attr];
        };

        /**
         * Filtra uma lista de anotações de acordo com o parâmetro atual de pesquisa e 
         * com a dada entrada(importante para filtrar o título, conteúdo...).
         *
         * @param   {Array}  notes As anotações a serem filtradas.
         * @param   {String} input O valor da caixa de entrada.
         * @returns {Array} As anotações filtradas.
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
         * Valida uma anotação de acordo com a constraint de parametros. A anotação é válida
         * se tem todas as constraints válidas.
         *
         * @param   {Note}    note   A anotação a ser validada.
         * @param   {Array}   params Os parâmetros de constraint.
         * @returns {boolean} true se a anotação é valida, false caso contrário.
         */
        function validateConstraintParams(note, params) {
            var isValid = true;
            _.each(params, function (value, attr) {
                isValid = isValid && isFilterValid(note, attr, value.value);
            });
            return isValid;
        }

        /**
         * Valida uma anotação de acordo com parâmetros 'non-constraint'. A anotação é válida
         * se tem pelo menos um dos parâmetros validados.
         *
         * @param   {Note}    note   A anotação a ser validada.
         * @param   {Array}   params Os parâmetros de constraint.
         * @returns {boolean} true se a anotação é válida, false caso contrário.
         */
        function validateAtLeastOneParam(note, params) {
            var isValid = false;
            _.each(params, function (value, attr) {
                isValid = isValid || isFilterValid(note, attr, value.value);
            });
            return isValid;
        }

        /**
         * Preenche os parâmetros de entrada. Eles não são constraints. Se a string dada 
         * é uma substring de um dos parâmetros adicionados, a anotação é válida.
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
         * Filtra uma anotação para determinar se é válida de acordo com os parâmetros.
         *
         * @param   {Note}             note  A anotação a ser analizada.
         * @param   {String | Array}   attrs  Atributos da anotação a ser validada.
         * @param   {String | boolean} value Valor para o atributo ser válido.
         * @returns {boolean} true se a anotação é válida de acordo com o valor.
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
         * Verifica se duas strings são iguais ou se a primeira contém a segunda.
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
