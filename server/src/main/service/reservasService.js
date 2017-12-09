import { LocaisService } from "./LocaisService";
import { UsersService } from "./usersService";

import Reserva from '../model/Reserva';
import _ from '../util/util';

require('../config/db_config')();

/**
 * Consulta uma reserva dados os parâmetros de busca.
 * 
 * @param   {Object}           [params = {}] Parâmetros da consulta de reservas.
 * @returns {Promise.<Object>} Promise resolvida com reserva consultada diretamente pelo Mongoose.
 * @private
 */
const _consultarReservas = (params = {}) => new Promise(
    (resolve, reject) => Reserva.find(params,
        (err, result) => (err) ? reject(err) : resolve(result)
    )
);

/**
 * Persiste uma reserva no banco de dados.
 *
 * @param   {Reserva}          reserva  Reserva a ser persistida (Schema).
 * @returns {Promise.<Object>} Promise resolvida com reserva persistida (objeto extraído do mongoose).
 * @private
 */
const _persistirReserva = reserva => new Promise(
    (resolve, reject) => reserva.save(
        (err, resultado) => (err) ? reject(err) : resolve(resultado.toObject())
    )
);

/**
 * Remove uma reserva do banco de dados.
 *
 * @param   {Reserva}           reserva  Reserva a ser removida (Schema).
 * @returns {Promise.<Object>} Promise resolvida o objeto de mensagem de remoção com sucesso.
 * @private
 */
const _removerReserva = reserva => new Promise(
    (resolve, reject) => reserva.remove(
        err => err ? reject(err) : resolve({
            mensagem: "Remoção efetuada com sucesso."
        })
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
 * @param   {Reserva}                 reserva Reserva a ser validada.
 * @returns {Promise.<String | null>} Promise resolvida com null ou rejeitada com mensagem de erro.
 * @private
 */
const _validarHorario = reserva => new Promise(async (resolve, reject) => {
    const intervaloNegativo = reserva.inicio >= reserva.fim;
    if (intervaloNegativo) return reject("Intervalo de horários inválido.");

    const local = await LocaisService.consultarLocalPorId(reserva.localId);
    if (reserva.inicio < local.inicio_funcionamento || reserva.fim > local.fim_funcionamento)
        return reject('Reserva fora de intervalo de funcionamento do Local.');

    const horarioAtual = new Date();
    const horarioAtualFormatado = `${horarioAtual.getHours()}:${horarioAtual.getMinutes()}`;
    if (reserva.inicio < horarioAtualFormatado)
        return reject('Reserva não pode ser cadastrada em horário passado.');

    return Reserva.findByDayAndLocalId(reserva.dia, reserva.localId, (err, reservas) => {
        if (err) return reject(err);
        for (let i in reservas) {
            const r = reservas[i];
            if (r._id.toString() === reserva._id) {
                continue;
            }
            if (_hasChoqueHorario(r, reserva)) {
                return reject("Horário ocupado.");
            }
        }
        return resolve(null);
    });
});

/**
 * Retorna uma reserva dado o id da mesma e o email do usuário. Mesmo sendo por id,
 * o email do usuário serve apenas como condição para a reserva ser retornada, ou seja, só retornar
 * reservas cujo autor foi o usuário.
 * 
 * @param   {String}            email     Email do usuário.
 * @param   {String}            idReserva Id da reserva a ser retornada.
 * @returns {Promise.<Reserva>} Promise resolvida com objeto Reserva do mongo.
 * @private
 */
const _consultarReserva = (email, idReserva) => new Promise(async(resolve, reject) => {
    return Reserva.findById(email, idReserva,
        (err, result) => err ? reject(err) : resolve(result)
    );
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
 * @param  {Reserva} reserva1
 * @param  {Reserva} reserva2 
 * @return {Boolean} True caso haja choque de horário entre as reservas.
 * @private
 */
function _hasChoqueHorario(reserva1, reserva2) {
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

/**
 * Objeto representando o Service de Reservas. Responsável pela lógica de negócio das Resevas da aplicação.
 */
export const ReservasService = {

    /**
     * Obtém todas as reservas do local que teve o id especificado.
     *
     * @param   {String}                   localId Id do local a ter suas reservas retornadas.
     * @returns {Promise.<Array.<Object>>} Promise resolvida com a lista de reservas do dado local.
     */
    async getReservasDoLocal(localId) {
        return _consultarReservas({
            localId: localId
        });
    },

    /**
     * Cria uma nova reserva em nosso banco de dados.
     *
     * @param   {String}           token    Token de identificação do usuário logado.
     * @param   {Object}           reserva  Nova reserva a ser persistida.
     * @returns {Promise.<Object>} Promise resolvida com objeto da reserva persistida.
     */
    async salvarReserva(token, reserva) {
        const usuario = await UsersService.getUser(token);
        await LocaisService.consultarLocalPorId(reserva.localId);

        reserva.emailAutor = usuario.email;
        reserva.userId = usuario.user_id;
        reserva.autor = usuario.user_metadata.nome_completo;

        await _validarHorario(reserva);
        return _persistirReserva(new Reserva(reserva));
    },

    /**
     * Atualiza as propriedades de uma reserva já
     * existente em nosso banco de dados.
     *
     * @param   {String}           token       Token de identificação do usuário logado.
     * @param   {String}           idReserva   Id da reserva original.
     * @param   {Object}           novaReserva Reserva atualizada a ser persistida.
     * @returns {Promise.<Object>} Promise resolvida com objeto da reserva atualizada.
     */
    async atualizarReserva(token, idReserva, novaReserva) {
        const usuario = await UsersService.getUser(token);
        const reserva = await _consultarReserva(usuario.email, idReserva);
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
     * @param   {String}           token      Token de identificação do usuário logado.
     * @param   {String}           idReserva  Id da reserva desejada.
     * @returns {Promise.<Object>} Promise resolvida com a reserva consultada.
     */
    async getReserva(token, idReserva) {
        const usuario = await UsersService.getUser(token);
        const reserva = await _consultarReserva(usuario.email, idReserva);
        return (reserva || {}).toObject();
    },

    /**
     * Deleta uma reserva dado o seu Id.
     *
     * @param   {String}           token     Token de identificação do usuário logado.
     * @param   {String}           idReserva Id da reserva a ser deletada.
     * @returns {Promise.<Object>} Promise resolvida com o objeto de sucesso.
     */
    async deletarReserva(token, idReserva) {
        //TODO: Validar deleção
        const usuario = await UsersService.getUser(token);
        const reserva = await _consultarReserva(usuario.email, idReserva);
        return _removerReserva(reserva);
    }
};