import _ from '../util/util';
import Local from '../model/Local';

export class LocaisService {

    constructor(db_profile = 'SCORE') {
        require('../config/db_config')(db_profile);
    }

    salvarLocal(local) {
        const localMongoose = new Local(local);

        return new Promise((resolve, reject) =>
            localMongoose.save((err, result) =>
                (err) ? reject(err.message || err) : resolve(this.retornarLocal(result)))
        );
    }

    consultarLocalPorId(idLocal) {
        return new Promise((resolve, reject) =>
            Local.findById(idLocal, (err, result) => {
                if (err || !result)
                    return reject(err || _.notFoundResponse(`Não existe local com o id especificado.`));
                return resolve(this.retornarLocal(result));
            })
        );
    }

    retornarLocal(localMongoose) {
        const local = localMongoose.toObject();
        delete local.__v;
        return local;
    }

    // atualizarLocal(idLocal, local) {
    //     const localMongoose = new Local(local);
    //
    //     return new Promise((resolve, reject) => );
    // }
}

