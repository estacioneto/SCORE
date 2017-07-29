(function(){
    'use strict';

    let express = require('express');

    let usersService = require('../service/usersService'),
        _ = require('../util/util');

    /**
     * Esta é a rota para acessar o usuário. Ainda não está em uso.
     * (Talvez possa ser usado no futuro... talvez não, porque o nosso client app
     * armazena o usuário. Bem... Nós podemos discutir isso na reunião).
     *
     * Endpoint: /users
     * @author Estácio Pereira
     */
    let usersRouter = express.Router();

    /**
     * O método HTTP GET para recuperar o usuário logado. 
     * (Bem... o Auth0 pode fazer isso.. Fizemos isso com cache... Novamente, 
     * precisamos discutir isso na reunião).
     */
    usersRouter.get('/', (req, res) => {
        let token = _.getToken(req);
        usersService.getUser(token, (err, user) => {
            if (err) {
                return res.status(err.status || _.BAD_REQUEST).json(err.message || err);
            }
            return res.status(_.OK).json(user);
        });
    });

    module.exports = usersRouter;
})();
