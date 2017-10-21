import {
    LocaisService
} from "./LocaisService";
import {
    UsersService
} from "./usersService";

import Reserva from '../model/Reserva';
import _ from '../util/util';

const _consultarReservas = (params = {}) => new Promise(
    (resolve, reject) => Reserva.find({},
        (err, result) => (err) ? reject(err) : resolve(result)
    )
);

/**
 * Persiste uma reserva no banco de dados.
 *
 * @param {Object}   reserva  Reserva a ser persistida.
 * @param {Function} callback Função chamada após erro ou sucesso na operação.
 */
const _persistirReserva = (reserva, callback) => new Promise(
    (resolve, reject) => reserva.save(
        (err, resultado) => (err) ? reject(err) : resolve(resultado.toObject())
    )
);

const _removerReserva = async reserva => new Promise(
    (resolve, reject) => reserva.remove(
        err => err ? reject(err) : resolve("Deleção efetuada com sucesso.")
    )
);

/**
 * Realiza as validações relacionadas ao horário da reserva.
 * Verifica se o horário da reserva intercepta algum outro
 * para o mesmo dia.
 * Valida se o intervalo de horas é positivo.
 * 
 * TODO: Se esse método crescer, criar um validador. @author Eric Breno
 * 
 * @param {Reserva} reserva Reserva a ser validada.
 * @param {Function} cb Callback a ser invocado com resultado. Se algum
 *                      dado estiver incorreto, o callback é invocado com
 *                      a mensagem de erro.
 */
const _validarHorario = (reserva, cb) => new Promise((resolve, reject) => {
    const intervaloNegativo = reserva.inicio >= reserva.fim;
    if (intervaloNegativo) return reject("Intervalo de horários inválido.");

    return Reserva.findByDayAndLocalId(reserva.dia, reserva.localId, (err, reservas) => {
        if (err) return reject(err);
        for (let i in reservas) {
            const r = reservas[i];
            if (r._id.toString() === reserva._id) {
                continue;
            }
            if (hasChoqueHorario(r, reserva)) {
                return reject("Horário ocupado.");
            }
        }
        return resolve(null);
    });
});

const _getReservaById = (token, idReserva) => new Promise(async(resolve, reject) => {
    const usuario = await UsersService.getUser(token);
    return Reserva.findById(usuario.email, idReserva, (err, result) => (err) ? reject(err) : resolve(result));
});

/**
 * Verifica se as duas reservas têm choque de horários.
 * 
 * * Validações da reserva atualizada AT com a reserva já salva BD:
 * 1- Intervalo de AT tem início de BD.
 *         BD            AT
 *  * 01:00-02:00 <> 00:30-01:30
 *  * 01:00-02:00 <> 00:30-02:30
 * 
 * 2- Intervalo de AT tem fim de BD.
 *         BD            AT
 *  * 01:00-02:00 <> 01:30-02:30
 *  * 01:00-02:00 <> 00:30-02:30
 * 
 * 3- AT está contida ou tem mesmo intervalo de BD.
 *         BD            AT
 *  * 00:00-01:00 <> 00:30-00:50
 *  * 00:00-01:00 <> 00:00-00:50
 *  * 00:00-01:00 <> 00:30-01:00
 * 
 * 4- BD está contida ou tem mesmo intervalo de AT.
 *         BD            AT
 *  * 01:00-02:00 <> 00:30-02:30
 *  * 01:00-02:00 <> 01:00-02:30
 *  * 01:00-02:00 <> 00:30-02:00
 * 
 * @param {Reserva} reserva1
 * @param {Reserva} reserva2 
 * @return {Boolean} True caso haja choque de horário entre as reservas.
 */
function hasChoqueHorario(reserva1, reserva2) {
    const inicio1 = reserva1.inicio;
    const fim1 = reserva1.fim;
    const inicio2 = reserva2.inicio;
    const fim2 = reserva2.fim;

    const caso1 = inicio1 < inicio2 && fim1 > inicio2;
    const caso2 = inicio1 < fim2 && fim1 > fim2;
    const caso3 = inicio1 >= inicio2 && fim1 <= fim2;
    const caso4 = inicio1 <= inicio2 && fim1 >= fim2;
    return caso1 || caso2 || caso3 || caso4;
}

const ReservasService = {

    /**
     * Obtém todas as reservas.
     *
     * @param {String}   token    Token de identificação do usuário logado.
     */
    async getReservas(token) {
        await UsersService.getUser(token);
        return _consultarReservas();
    },

    /**
     * Obtém todas as reservas do local que teve o id especificado.
     *
     * @param {String}   token    Token de identificação do usuário logado.
     * @param {String}   localId  Id do local a ter suas reservas retornadas.
     */
    async getReservasDoLocal(token, localId) {
        await UsersService.getUser(token);
        return _consultarReservas({
            localId: localId
        });
    },

    /**
     * Cria uma nova reserva em nosso banco de dados.
     *
     * @param {String}   token    Token de identificação do usuário logado.
     * @param {Object}   reserva  Nova reserva a ser persistida.
     * @param {Function} callback Função chamada após erro ou sucesso na operação.
     */
    async salvarReserva(token, reserva) {
        const usuario = await UsersService.getUser(token);
        await LocaisService.consultarLocalPorId(reserva.localId);

        reserva.emailAutor = usuario.email;
        reserva.userId = usuario.user_id;
        reserva.autor = usuario.user_metadata.nome_completo;

        await _validarHorario(reserva);
        return _persistirReserva(new Reserva(reserva), callback);
    },

    /**
     * Atualiza as propriedades de uma reserva já
     * existente em nosso banco de dados.
     *
     * @param {String}   token       Token de identificação do usuário logado.
     * @param {String}   idReserva   Id da reserva original.
     * @param {Object}   novaReserva Reserva atualizada a ser persistida.
     */
    async atualizarReserva(token, idReserva, novaReserva) {
        const reserva = await _getReservaById(token, idReserva);
        let reservaAntiga = reserva;
        // FIXME: Desfazer isso quando passarmos a utilizar
        // patch corretamente. Necessário por a atualização
        // atual assumir que deve deletar propriedades que não
        // foram enviadas do cliente, e estas não são realmente enviadas nunca.
        // @author Eric Breno - 29/07/17
        novaReserva.emailAutor = reservaAntiga.emailAutor;
        novaReserva.userId = reservaAntiga.userId;
        novaReserva.autor = reservaAntiga.autor;

        await _validarHorario(novaReserva);
        _.updateModel(reservaAntiga, novaReserva);
        return _persistirReserva(reservaAntiga);
    },

    /**
     * Obtém uma reserva dado o seu Id.
     *
     * @param {String}   token      Token de identificação do usuário logado.
     * @param {String}   idReserva  Id da reserva desejada.
     */
    async getReservaById(token, idReserva) {
        const reserva = await _getReservaById(token, idReserva);
        return (reserva || {}).toObject();
    },

    /**
     * Deleta uma reserva dado o seu Id.
     *
     * @param {String}   token     Token de identificação do usuário logado.
     * @param {String}   idReserva Id da reserva a ser deletada.
     * @param {Function} callback  Função chamada após erro ou sucesso na operação.
     */
    async deletarReserva(token, idReserva, callback) {
        //TODO: Validar deleção
        const reserva = await _getReservaById(token, idReserva);
        return _removerReserva(reserva);
    }
};

export {
    ReservasService
};