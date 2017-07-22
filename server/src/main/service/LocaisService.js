import _ from '../util/util';
import Local from '../model/Local';

/**
 * Service responsável pela lógica de Locais.
 *
 * @author Estácio Pereira.
 * @class
 */
export class LocaisService {

    /**
     * Construtor padrão. Deve ser uma instância para inicializar o banco de dados com o perfil correto.
     *
     * @param {String} db_profile Perfil do banco de dados.
     * @constructor
     */
    constructor(db_profile = 'SCORE') {
        require('../config/db_config')(db_profile);
    }

    /**
     * Salva um local no banco de dados.
     *
     * @param   {Object}  local Objeto com os dados de local.
     * @returns {Promise} Promise de salvamento do local no banco de dados.
     */
    salvarLocal(local) {
        const localMongoose = new Local(local);

        return new Promise((resolve, reject) =>
            localMongoose.save((err, result) =>
                (err) ? reject(err.message || err) : resolve(_.mongooseToObject(result)))
        );
    }

    /**
     * Consulta um local dado o id do mesmo.
     *
     * @param   {String | ObjectId} idLocal Id do local a ser consultado.
     * @returns {Promise} Promise de consulta do local, resolvida com o objeto pronto para retorno do REST.
     */
    consultarLocalPorId(idLocal) {
        return this.getMongooseLocalPorId(idLocal)
            .then(localMongoose => _.mongooseToObject(localMongoose));
    }

    /**
     * Consulta e retorna um Mongoose Model do local dado o id do mesmo.
     *
     * @param   {String | ObjectId} idLocal Id do local a ser consultado.
     * @returns {Promise} Promise de consulta do local, resolvida com um Mongoose Model.
     */
    getMongooseLocalPorId(idLocal) {
        return new Promise((resolve, reject) =>
            Local.findById(idLocal, (err, result) => {
                if (err || !result) return reject(err || _.notFoundResponse(_.CONSTANTES_LOCAL.ERRO_LOCAL_NAO_ENCONTRADO));
                return resolve(result);
            })
        );
    }

    /**
     * Atualiza um local dado o id e os novos dados do Local.
     *
     * @param   {String | ObjectId} idLocal   Id do local a ser consultado.
     * @param   {Object}            novoLocal Objeto contendo as novas propriedades do local.
     * @returns {Promise} Promise da atualização, resolvida com o objeto atualizado pronto para o retorno.
     */
    atualizarLocal(idLocal, novoLocal) {
        return this.getMongooseLocalPorId(idLocal)
            .then(localPersistido => {
                _.updateModel(localPersistido, novoLocal);
                return new Promise((resolve, reject) =>
                    localPersistido.save((err, result) =>
                        (err) ? reject(err.message || err) : resolve(_.mongooseToObject(result)))
                );
            });
    }

    /**
     * Remove um local dado o id do mesmo.
     *
     * @param   {String | ObjectId} idLocal Id do local a ser consultado.
     * @returns {Promise} Promise de remoção do local, resolvida com o local removido.
     */
    deletarLocal(idLocal) {
        return this.getMongooseLocalPorId(idLocal)
            .then(localPersistido =>
                new Promise((resolve, reject) =>
                    localPersistido.remove((err, result) => {
                        if (err) return reject(err);
                        return resolve(_.mongooseToObject(result));
                    }))
            );
    }
}

