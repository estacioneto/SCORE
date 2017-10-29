import express from 'express';

import { PermissoesMiddleware } from '../middleware/permissoes/PermissoesMiddleware';

import { ReservasService } from '../service/reservasService';

import _ from '../util/util';

/**
 * Router utilizado para acessar as reservas.
 *
 * Endpoint: /reservas
 * @author Lucas Diniz
 */
const reservasRouter = express.Router();

/**
 * Salva uma nova reserva
 */
reservasRouter.post('/', [PermissoesMiddleware.getReservasMiddleware()], async(req, res) => {
    try {
        const reserva = await ReservasService.salvarReserva(_.getToken(req), req.body);
        return res.status(_.CREATED).json(reserva);
    } catch (err) {
        return res.status(err.status || _.BAD_REQUEST).json(err.message || err);
    }
});

/**
 * Atualiza a reserva com o id passado
 */
reservasRouter.patch('/:id', [PermissoesMiddleware.getReservasMiddleware()], async(req, res) => {
    try {
        const reserva = await ReservasService.atualizarReserva(_.getToken(req), req.params.id, req.body);
        return res.status(_.OK).json(reserva);
    } catch (err) {
        return res.status(err.status || _.BAD_REQUEST).json(err.message || err);
    }
});

/**
 * Obtém a reserva com o id passado
 */
reservasRouter.get('/:id', async(req, res) => {
    try {
        const reserva = await ReservasService.getReserva(_.getToken(req), req.params.id);
        return res.status(_.OK).json(reserva);
    } catch (err) {
        return res.status(err.status || _.BAD_REQUEST).json(err.message || err);
    }
});

/**
 * Deleta a reserva com o id passado
 */
reservasRouter.delete('/:id', [PermissoesMiddleware.getReservasMiddleware()], async(req, res) => {
    try {
        const reserva = await ReservasService.deletarReserva(_.getToken(req), req.params.id);
        return res.status(_.OK).json(reserva);
    } catch (err) {
        return res.status(err.status || _.BAD_REQUEST).json(err.message || err);
    }
});

module.exports = reservasRouter;