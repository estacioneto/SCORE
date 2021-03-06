import _ from '../util/util';
import Local from '../model/Local';

require('../config/db_config')();

/**
 * Service responsável pela lógica de Locais.
 *
 * @author Estácio Pereira.
 * @class
 */
export class LocaisService {

    /**
     * Salva um local no banco de dados.
     *
     * @param   {Object}  local Objeto com os dados de local.
     * @returns {Promise} Promise de salvamento do local no banco de dados.
     */
    static cadastrarLocal(local) {
        const localMongoose = new Local(local);
        return new Promise((resolve, reject) => {
            const err = LocaisService.validarImagens(local.imagens);
            if (err) {
                reject(err);
            } else {
                localMongoose.save((err, result) =>
                    (err) ? reject(err.message) : resolve(_.mongooseToObject(result)));
            }
        });
    }

    /**
     * Consulta um local dado o id do mesmo.
     *
     * @param   {String | ObjectId} idLocal Id do local a ser consultado.
     * @returns {Promise} Promise de consulta do local, resolvida com o objeto pronto para retorno do REST.
     */
    static consultarLocalPorId(idLocal) {
        return LocaisService.getMongooseLocalPorId(idLocal)
            .then(localMongoose => _.mongooseToObject(localMongoose));
    }

    /**
     * Consulta a lista com todos os locais do sistema.
     *
     * @returns {Promise} Promise de consulta resolvida com a lista de locais.
     */
    static consultarLocais() {
        return new Promise((resolve, reject) => {
            Local.find({}, (err, results) => {
                if (err) return reject(err);
                const locais = results.map(local => _.mongooseToObject(local))
                    .map(local => {
                        local.imagens && _.first(local.imagens) && (local.imagens = [_.first(local.imagens)]);
                        return local;
                    });
                return resolve(locais);
            });
        });
    }

    /**
     * Consulta e retorna um Mongoose Model do local dado o id do mesmo.
     *
     * @param   {String | ObjectId} idLocal Id do local a ser consultado.
     * @returns {Promise} Promise de consulta do local, resolvida com um Mongoose Model.
     */
    static getMongooseLocalPorId(idLocal) {
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
    static atualizarLocal(idLocal, novoLocal) {
        return LocaisService.getMongooseLocalPorId(idLocal)
            .then(localPersistido => {
                _.updateModel(localPersistido, novoLocal);
                return new Promise((resolve, reject) => {
                    const err = LocaisService.validarImagens(novoLocal.imagens);
                    if (err) {
                        reject(err);
                    } else {
                        localPersistido.save((err, result) => (err) ? reject(err.message) : resolve(_.mongooseToObject(result)));
                    }
                });
            });
    }

    /**
     * Remove um local dado o id do mesmo.
     *
     * @param   {String | ObjectId} idLocal Id do local a ser consultado.
     * @returns {Promise} Promise de remoção do local, resolvida com o local removido.
     */
    static deletarLocal(idLocal) {
        return LocaisService.getMongooseLocalPorId(idLocal)
            .then(localPersistido =>
                new Promise((resolve, reject) =>
                    localPersistido.remove((err, result) => {
                        if (err) return reject(err);
                        return resolve(_.mongooseToObject(result));
                    }))
            );
    }

    /**
     * Verifica a validade das imagens para local.
     * - Verifica se o tipo é válido.
     * - Se todas as imagens tem menos de 16 MB.
     * 
     * @param {Array<Object>} imagens Lista de imagens.
     * @return {String} Mensagem de validação, vazio caso esteja tudo ok.
     */
    static validarImagens(imagens) {
        let mensagemErro = '';
        const TIPOS = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/bitmap'];
        const inicioTipo = 5,
            fimTipo = 30;
        const TAM_MAX = 16 * 1000 * 1000;
        const getTipoArquivo = arquivo => {
            const inicioArquivo = arquivo.conteudo.substring(inicioTipo, fimTipo);
            const tipo = _.first(inicioArquivo.split(';base64'));
            return tipo;
        };

        imagens.forEach(imagem => {
            const tipoArquivo = getTipoArquivo(imagem);
            // https://stackoverflow.com/questions/2219526/how-many-bytes-in-a-javascript-string
            const tamImagem = imagem.conteudo.split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length - 1;

            if (tamImagem > TAM_MAX) {
                mensagemErro = "O tamanho máximo suportado é 16MB. "
            }
            if (!_.includes(TIPOS, tipoArquivo)) {
                mensagemErro += "Tipo de imagem não suportado, deve ser jpg, jpeg, png, bitmap ou gif."
            }
        });
        return mensagemErro;
    }
}