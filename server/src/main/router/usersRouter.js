(function(){
    'use strict';

    let express = require('express');

    let usersService = require('../service/usersService'),
        _ = require('../util/util');

    /**
     * This is the router to access the user. Today we don't use it yet.
     * Maybe it could be useful on future... Maybe not, because our client app
     * stores the user. Well... We could set up a meeting to discuss that...
     *
     * Endpoint: /users
     * @author Estácio Pereira
     */
    let usersRouter = express.Router();

    /**
     * The HTTP GET method to get the logged user. Well... Auth0 could do that.
     * We do it with cache... Again, we need a meeting.
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
