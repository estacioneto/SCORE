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

    /**
     * Retorna um state de agenda.
     *
     * @param   {Object} [state = {}] Alterações desejadas no state padrão.
     * @returns {Object} Objeto do state.
     */
    function getAgendaState(state = {}) {
        return Object.assign({
            nome: 'app.agenda',
            mdIcon: 'event',
            url: '/agenda',
        }, state);
    }

    angular.module('constantesModulo', []).constant('APP_STATES', {
        APP: {nome: 'app'},
        DIA: {nome: 'app.dia'},
        LOGIN: {nome: 'app.login'},
        AGENDA: getAgendaState({
            abstract: true,
            template: '<ui-view/>',
        }),
        AGENDA_INFO: getAgendaState({
            nome: 'app.agenda.info',
            url: '',
            templateUrl: 'view/listagem-agenda.html',
            controller: 'ListagemAgendaController as agendaCtrl'
        }),
        AGENDA_ID: getAgendaState({
            nome: 'app.agenda.id',
            url: '/:idLocal',
            templateUrl: 'view/agenda.html',
            controller: 'AgendaController as agendaCtrl',
            resolve: {
                local: ($stateParams, LocaisService) => LocaisService.carregarLocal($stateParams.idLocal)
                    .then(info => info.data)
            }
        }),
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