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
        });
    };

    /**
     * Verifica se existe choque de horário entre a reserva e a lista
     * de reservas passadas. Não é checado a reserva com ela mesma nem a reserva
     * com sua reserva pai ou reservas com mesmo pai.
     * 
     * @param {Reserva} reserva Reserva a ser checada.
     * @param {[Reserva]} reservas Lista de reservas.
     * @return {String} String contendo a mensagem sobre quais reservas dão choque, se houverem. 
     */
    static verificarChoque(reserva, reservas) {
        let diasOcupados = [];
        for (let i in reservas) {
            const r = reservas[i];
            const mesmaReserva = r._id.toString() === reserva._id;
            const reservaFilha = r.eventoPai === reserva._id;
            const reservaIrma = r.eventoPai === reserva.eventoPai;
            if (mesmaReserva || reservaFilha || reservaIrma) {
                continue;
            }
            if (ReservasValidador.hasChoqueHorario(r, reserva)) {
                const dateDia = new Date(r.dia);
                const diaFormatado = `${dateDia.getDate()}/${dateDia.getMonth() + 1}/${dateDia.getFullYear()}`;
                diasOcupados.push(`${diaFormatado}`);
            }
        }
        if (diasOcupados.length > 0) {
            return `Horário ocupado para o(s) dia(s) ${diasOcupados.join(", ")}.`;
        }
        return "";
    }

    /**
     * Checa se alguma das repetições da reserva é inválida, ou, tenha choque de horário
     * com outra reserva já cadastrada.
     * 
     * @param {Reserva} reserva Reserva a ter as repetições checadas.
     * @param {Function} cb Callback executado ao finalizar a operação.
     */
    static checarRepeticoes(reserva, cb) {
        let diasRepeticoes = ReservasValidador.calcularDiasRepeticao(reserva);

        Reserva.findInDays(diasRepeticoes, reserva.localId, (err, reservas) => {
            if (err) return cb(err);
            const choque = ReservasValidador.verificarChoque(reserva, reservas);
            cb(choque);
        });
    };

    /**
     * Calcula os dias (em Date, no formato ISO) das repetições
     * para uma Reserva.
     * 
     * @param {Reserva} reserva Reserva a ter os dias das repetições calculados.
     * @return {[String]} Lista das datas de repetição, no formato ISO.
     */
    static calcularDiasRepeticao(reserva) {
        const INTERVALO_REPETICAO = reserva.frequencia;
        const diasRepeticao = [];
        const dataFim = new Date(reserva.fimRepeticao);
        const dataReserva = new Date(reserva.dia);

        let diasExtras = dataReserva.getDate() + INTERVALO_REPETICAO;
        dataReserva.setDate(diasExtras);
        while (dataReserva <= dataFim) {
            let diaStr = dataReserva.toISOString();
            diasRepeticao.push(diaStr);
            
            diasExtras = dataReserva.getDate() + INTERVALO_REPETICAO;
            dataReserva.setDate(diasExtras);
        }
        return diasRepeticao;
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