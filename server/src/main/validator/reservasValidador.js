require('../config/db_config')();
const Reserva = require('../model/Reserva');

export class ReservasValidador {

    /**
     * Realiza as validações relacionadas ao horário da reserva.
     * Verifica se o horário da reserva intercepta algum outro
     * para o mesmo dia.
     * Valida se o intervalo de horas é positivo.
     * 
     * @param {Reserva} reserva Reserva a ser validada.
     * @param {Function} cb Callback a ser invocado com resultado. Se algum
     *                      dado estiver incorreto, o callback é invocado com
     *                      a mensagem de erro.
     */
    static validarHorario(reserva, cb) {
        const intervaloNegativo = reserva.inicio >= reserva.fim;
        if (intervaloNegativo) return cb("Intervalo de horários inválido.");

        Reserva.findByDayAndLocalId(reserva.dia, reserva.localId, (err, reservas) => {
            if (err) return cb(err);
            const choque = ReservasValidador.verificarChoque(reserva, reservas);
            if (choque) return cb(choque);

            ReservasValidador.checarRepeticoes(reserva, cb);
            return cb(null);
        });
    };

    static verificarChoque(reserva, reservas) {
        for (let i in reservas) {
            const r = reservas[i];
            if (r._id.toString() === reserva._id) {
                continue;
            }
            if (ReservasValidador.hasChoqueHorario(r, reserva)) {
                return `Horário ocupado para o dia ${r.dia}`;
            }
        }
        return "";
    }

    static checarRepeticoes(reserva, cb) {
        let diasRepeticoes = [];
        let dataFim = new Date(reserva.fimRepeticao);
        let dataReserva = new Date(reserva.dia);
        let diasExtras = dataReserva.getDate() + 1 + reserva.frequencia;
        dataReserva.setDate(diasExtras);
        while (dataReserva <= dataFim) {
            let diaStr = `${dataReserva.getFullYear()}-${dataReserva.getMonth() + 1}-${dataReserva.getDate()}`;
            diasRepeticoes.push(diaStr);
            
            diasExtras += reserva.frequencia;
            dataReserva.setDate(diasExtras);
        }
        console.log("dias das repeticoes", diasRepeticoes);
        Reserva.findFutureFrom(reserva.dia, reserva.fimRepeticao, reserva.localId, (err, reservas) => {
            if (err) return cb(err);
            console.log("Reservas futuras", reservas);
            ReservasValidador.verificarChoque(reserva, reservas);
        });
    };

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
    static hasChoqueHorario(reserva1, reserva2) {
        const inicio1 = reserva1.inicio;
        const fim1 = reserva1.fim;
        const inicio2 = reserva2.inicio;
        const fim2 = reserva2.fim;

        const caso1 = inicio1 <  inicio2 && fim1 >  inicio2;
        const caso2 = inicio1 <  fim2    && fim1 >  fim2;
        const caso3 = inicio1 >= inicio2 && fim1 <= fim2;
        const caso4 = inicio1 <= inicio2 && fim1 >= fim2;
        return caso1 || caso2 || caso3 || caso4;
    };
};