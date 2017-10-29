import express from 'express';
import _ from '../util/util';

import {
    ReservasService
} from '../service/reservasService';

/**
 * Configura o GET em /api/locais/:id/reservas. Retorna as reservas do local dado o id.
 *
 * @param {Router} router Express Router.
 */
function getReservasPorLocal(router) {
    router.get('', async (req, res) => {
        try {
            const reservas = await ReservasService.getReservasDoLocal(req.params.id);
            return res.status(_.OK).json(reservas);
        } catch (err) {
            return res.status(err.status || _.BAD_REQUEST).json(err.message || err);
        }
    });
}

/**
 * Configura e retorna os routers de Locais.
 *
 * @param   {Router} router Router limpo.
 * @returns {Router} Router configurado.
 */
function getReservasSubRouter(router) {
    configurarRouter(router);
    return router;
}

/**
 * Configura o router e seus endpoints.
 *
 * @param {Router} router Router a ser configurado.
 */
function configurarRouter(router) {
    getReservasPorLocal(router);
}

module.exports = getReservasSubRouter(express.Router({mergeParams: true}));