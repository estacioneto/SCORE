const PRIMEIRO_INDICE = 0;

/**
 * Remove um elemento no índice dado.
 *
 * @param {Number} index Índice do elemento.
 */
Array.prototype.remove = function (index) {
    this.splice(index, 1);
};

/**
 * Limpa o array por completo.
 */
Array.prototype.clear = function () {
    this.splice(0, this.length);
};

/**
 * Enfileira múltiplos elementos no array.
 *
 * @param {Array} elements Elementos a serem enfileirados.
 */
Array.prototype.pushAll = function (elements) {
    this.push.apply(this, elements);
};
