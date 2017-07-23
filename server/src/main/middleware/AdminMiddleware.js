import _ from '../util/util';
import UsersService from '../service/usersService';

/**
 * Função middleware que verifica se o usuário tem permissões de Admin.
 * Retorna Forbidden (403) se o usuário não for Admin
 *
 * @param {Object}   req  Requisição HTTP.
 * @param {Object}   res  Resposta da Requisição.
 * @param {Function} next Próxima função a ser chamada.
 * @constructor
 */
export function AdminMiddleware(req, res, next) {
    const token = _.last(req.header('Authorization').split(' '));

    UsersService.getUser(token, (err, usuario) => {
        if (err)
            return res.status(_.UNAUTHORIZED).json({mensagem: `Falha ao acessar recurso. ${(err || '')}.`});

        const permissoes = usuario.app_metadata.permissoes || [];
        if (!_.includes(permissoes, _.ADMIN))
            return res.status(_.FORBIDDEN).json({mensagem: _.ERRO_USUARIO_SEM_PERMISSAO});
        next();
    });
}