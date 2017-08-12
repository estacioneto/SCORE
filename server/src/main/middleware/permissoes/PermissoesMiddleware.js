import _ from '../../util/util';
import UsersService from '../../service/usersService';

/**
 * Classe responsável por criar middlewares de permissões.
 *
 * @class
 */
export class PermissoesMiddleware {

    /**
     * Função para retornar middleware que verifica se o usuário tem permissões de Admin.
     * @returns {Function} Middleware.
     */
    static getAdminMiddleware() {
        return PermissoesMiddleware.construirMiddleware();
    }

    /**
     * Função para retornar middleware que verifica se o usuário tem permissões acerca de Reserva.
     * @returns {Function} Middleware.
     */
    static getReservasMiddleware() {
        return PermissoesMiddleware.construirMiddleware(_.RESERVAS);
    }

    /**
     * Função geradora de middlewares de Permissão com comportamento padrão.
     *
     * @param   {String}            [permissao=''] Permissão a ser analisada.
     * @returns {function(*, *, *)} Retorna função middleware com implementação padrão de verificação.
     */
    static construirMiddleware(permissao = '') {
        return (req, res, next) => {
            const token = req.header(_.ACCESS_TOKEN);

            return new Promise((resolve, reject) =>
                UsersService.getUser(token, (err, usuario) => {
                    if (err)
                        return reject(res.status(_.FORBIDDEN).json({mensagem: `Falha ao acessar recurso. ${(err || '')}.`}));

                    const permissoes = usuario.app_metadata.permissoes || [];
                    // Como o Admin pode tudo, se incluir Admin, pode passar.
                    if (!_.includes(permissoes, _.ADMIN) && !_.includes(permissoes, permissao))
                        return reject(res.status(_.FORBIDDEN).json({mensagem: _.ERRO_USUARIO_SEM_PERMISSAO}));
                    return resolve(next());
                })
            );
        };
    }
}
