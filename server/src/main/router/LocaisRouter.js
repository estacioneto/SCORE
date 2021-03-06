import express from 'express';

import {PermissoesMiddleware} from '../middleware/permissoes/PermissoesMiddleware';
import ReservasSubRouter from '../router/ReservasSubRouter';
import {LocaisService} from "../service/LocaisService";

import _ from '../util/util';

/**
 * Configura o GET em /api/locais/:id. Retorna o local dado o id.
 *
 * @param {Router} router Express Router.
 */
function getLocal(router) {
    router.get('/:id', (req, res) =>
        LocaisService.consultarLocalPorId(req.params.id)
            .then(local => res.status(_.OK).json(local))
            .catch(_.retornarResponseErro(res))
    );
}

/**
 * Configura o GET em /api/locais/:id/reservas. Retorna as reservas do local dado o id.
 *
 * @param {Router} router Express Router.
 */
function getReservasPorLocal(router) {
    router.use('/:id/reservas', ReservasSubRouter);
}

/**
 * Configura o GET em /api/locais. Retorna a lista de locais do sistema.
 *
 * @param {Router} router Express Router.
 */
function getLocais(router) {
    router.get(['', '/'], (req, res) =>
        LocaisService.consultarLocais()
            .then(locais => res.status(_.OK).json(locais))
            .catch(_.retornarResponseErro(res))
    );
}

/**
 * Configura o POST em /api/locais. Cadastra um Local e retorna o local persistido.
 *
 * @param {Router} router Express Router.
 */
function cadastrarLocal(router) {
    router.post(['', '/'], [PermissoesMiddleware.getAdminMiddleware()], (req, res) =>
        LocaisService.cadastrarLocal(req.body)
            .then(localCadastrado => res.status(_.CREATED).json(localCadastrado))
            .catch(_.retornarResponseErro(res))
    );
}

/**
 * Configura o PUT em /api/locais/:id. Atualiza um local e retorna o local atualizado.
 *
 * @param {Router} router Express Router.
 */
function atualizarLocal(router) {
    router.put('/:id', [PermissoesMiddleware.getAdminMiddleware()], (req, res) =>
        LocaisService.atualizarLocal(req.params.id, req.body)
            .then(localAtualizado => res.status(_.OK).json(localAtualizado))
            .catch(_.retornarResponseErro(res))
    );
}

/**
 * Configura o DELETE em /api/locais/:id. Deleta um local e retorna o local atualizado.
 *
 * @param {Router} router Express Router.
 */
function deletarLocal(router) {
    router.delete('/:id', [PermissoesMiddleware.getAdminMiddleware()], (req, res) =>
        LocaisService.deletarLocal(req.params.id)
            .then(localRemovido => res.status(_.OK).json(localRemovido))
            .catch(_.retornarResponseErro(res))
    );
}

/**
 * Configura e retorna os routers de Locais.
 *
 * @param   {Router} router Router limpo.
 * @returns {Router} Router configurado.
 */
function getLocaisRouter(router) {
    configurarRouter(router);
    return router;
}

/**
 * Configura o router e seus endpoints.
 *
 * @param {Router} router Router a ser configurado.
 */
function configurarRouter(router) {
    getLocal(router);
    getLocais(router);
    cadastrarLocal(router);
    atualizarLocal(router);
    deletarLocal(router);
    configurarSubRouter(router);
}

/**
 * Configura o router incluindo seus subrouters e respectivos endpoints.
 *
 * @param {Router} router Router a ser configurado.
 */
function configurarSubRouter(router) {
    getReservasPorLocal(router);
}

module.exports = getLocaisRouter(express.Router());