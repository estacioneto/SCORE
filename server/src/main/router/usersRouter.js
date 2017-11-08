import express from 'express';

import {UsersService} from '../service/usersService';
import _ from '../util/util';

/**
 * Esta é a rota para acessar o usuário. Ainda não está em uso.
 * (Talvez possa ser usado no futuro... talvez não, porque o nosso client app
 * armazena o usuário. Bem... Nós podemos discutir isso na reunião).
 *
 * Endpoint: /users
 * @author Estácio Pereira
 */
const usersRouter = express.Router();

/**
 * O método HTTP GET para recuperar o usuário logado. 
 * (Bem... o Auth0 pode fazer isso.. Fizemos isso com cache... Novamente, 
 * precisamos discutir isso na reunião).
 */
usersRouter.get('/', async (req, res) => {
    const token = _.getToken(req);
    try {
        const usuario = await UsersService.getUser(token);
        return res.status(_.OK).json(usuario);
    } catch (err) {
        return res.status(err.status || _.BAD_REQUEST).json(err.message || err);
    }
});

module.exports = usersRouter;