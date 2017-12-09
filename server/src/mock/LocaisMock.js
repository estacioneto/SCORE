/**
 * Classe de Mock de Locais.
 *
 * @class
 */
export class LocaisMock {

    /**
     * Construtor padrão (apesar de métodos estáticos).
     *
     * @constructor
     */
    constructor() {
    }

    /**
     * Metodo estático para retonar um Mock de um local. É dado um objeto com as seguintes propriedades.
     *
     * @param   {ObjectId}       _id           Id do local.
     * @param   {String}         nome          Nome do local.
     * @param   {String}         bloco         Bloco do local.
     * @param   {Array.<Object>} equipamentos  Equipamentos disponíveis.
     * @param   {Number}         capacidade    Capacidade do local.
     * @param   {String}         funcionamento Horário de funcionamento do Local.
     * @returns {{_id, nome: string, bloco: string, equipamentos: Array, capacidade: number, funcionamento: string}} Mock do local.
     */
    static getLocal({_id, nome = 'Auditório Hattori', bloco = 'CN', equipamentos = [], capacidade = 800, funcionamento = '08:00 - 12:00', inicio_funcionamento = '08:00', fim_funcionamento = '12:00', imagens = []} = {}) {
        return {
            _id,
            nome,
            bloco,
            equipamentos,
            capacidade,
            inicio_funcionamento,
            fim_funcionamento,
            funcionamento,
            imagens
        };
    }
}
