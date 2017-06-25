(() => {

    /**
     * Removes an element in the given index.
     *
     * @param {Number} index Index of the element
     */
    Array.prototype.remove = function (index) {
        this.splice(index, 1);
    };

    /**
     * Clears the whole Array.
     */
    Array.prototype.clear = function () {
        this.splice(0, this.length);
    };

    /**
     * Pushes multiple elements to the array.
     *
     * @param {Array} elements Elements to be pushed.
     */
    Array.prototype.pushAll = function (elements) {
        this.push.apply(this, elements);
    };

})();