(() => {
    'use strict';

    angular.module('localModulo').service('LocaisService', ['$http', '$q', 'Local', function ($http, $q, Local) {

        // TODO: Implementar lógica inteira, @author Estácio Pereira.
        const auditorioSPLab = {nome: 'Auditório SPLab', predio: 'SPLab'},
            auditorioHattori = {nome: 'Auditório Hattori', predio: 'CN'},
            salaReunioes = {nome: 'Sala de Reuniões', predio: 'SPLab'};
        const locais = [auditorioSPLab, auditorioHattori, salaReunioes];

        this.carregarLocais = function () {
            return $q.when({data: locais.map(local => new Local(local))});
        }
    }]);
})();
