export class LocaisMock {

    constructor() {
    }

    static getLocal({_id, nome = 'Auditório Hattori', bloco = 'CN', equipamentos = [], capacidade = 800, funcionamento = '08:00 - 12:00'} = {}) {
        return {
            _id,
            nome,
            bloco,
            equipamentos,
            capacidade,
            funcionamento
        };
    }
}
