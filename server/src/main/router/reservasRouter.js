import {AdminMiddleware} from '../middleware/AdminMiddleware';

(function(){
    'use strict';

    let express = require('express');

    let reservasService = require('../service/reservasService')(),
        _ = require('../util/util');

    /**
     * Router utilizado para acessar as reservas.
     *
     * Endpoint: /reservas
     * @author Lucas Diniz
     */
    let reservasRouter = express.Router();

    /**
     * Salva uma nova reserva
     */
    reservasRouter.post('/', AdminMiddleware, (req, res) => {
        reservasService.salvaReserva(_.getToken(req), req.body, (err, result) => {
            if (err) {
                return res.status(err.status || _.BAD_REQUEST).json(err.message || err);
            }
            return res.status(_.CREATED).json(result);
        })
    });

    /**
     * Atualiza a reserva com o id passado
     */
    reservasRouter.patch('/:id', AdminMiddleware, (req,res) => {
        reservasService.atualizaReserva(_.getToken(req), req.params.id, req.body, (err,result) => {
            if (err) return res.status(err.status || _.BAD_REQUEST).json(err.message || err);
            return res.status(_.OK).json(result);
        });
    });

    /**
     * Obtém a reserva com o id passado
     */
    reservasRouter.get('/:id', (req,res) => {
        reservasService.getReservaById(_.getToken(req), req.params.id, (err,result) => {
            if (err) return res.status(err.status || _.BAD_REQUEST).json(err.message || err);
            return res.status(_.OK).json(result);
        });
    });

    /**
     * Deleta a reserva com o id passado
     */
    reservasRouter.delete('/:id', AdminMiddleware, (req, res) =>
        reservasService.deletaReserva(_.getToken(req), req.params.id, (err, result) => {
            if (err) return res.status(err.status || _.BAD_REQUEST).json(err.message || err);
            return res.status(_.OK).json(result);
        })
    );

    module.exports = reservasRouter;
})();
