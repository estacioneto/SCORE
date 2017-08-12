(() => {
    'use strict';

    /**
     * Retorna um objeto com os dados do state utilizados pela aplicação.
     *
     * @param   {string} nome Nome completo do state.
     * @returns {{nome: string, mdIcon: string}} Objeto do state.
     */
    function getLocalState(nome) {
        return {
            nome,
            mdIcon: 'location_on'
        };
    }

    angular.module('constantesModulo', []).constant('APP_STATES', {
        APP: {nome: 'app'},
        DIA: {nome: 'app.dia'},
        LOGIN: {nome: 'app.login'},
        HOME: {
            nome: 'app.home',
            mdIcon: 'home'
        },
        LOCAL: getLocalState('app.local'),
        LOCAL_INFO: getLocalState('app.local.info'),
        LOCAL_ID: getLocalState('app.local.id'),
        LOCAL_ID_INFO: getLocalState('app.local.id.info'),
        LOCAL_EDICAO: getLocalState('app.local.edicao'),
        LOCAL_ID_EDICAO: getLocalState('app.local.id.edicao')
    }).constant('PERMISSOES', {
        ADMIN: 'admin',
        RESERVAS: 'reservas'
    });
})();