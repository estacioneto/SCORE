(() => {
    'use strict';

    angular.module('localModulo').service('LocaisService', ['$http', '$q', 'Local', function ($http, $q, Local) {

        // TODO: Implementar lógica inteira, @author Estácio Pereira.
        const auditorioSPLab = {
                nome: 'Auditorio SPLab',
                bloco: 'CQ/SPLab',
                imagens: [],
                equipamentos: [{
                    nome: 'equipamento1',
                    quantidade: 1
                }, {
                    nome: 'equipamento2',
                    quantidade: 2
                }],
                capacidade: 40,
                funcionamento: '08:00-18:00'
            },
            auditorioHattori = {
                nome: 'Auditorio Hattori',
                bloco: 'CN',
                imagens: [],
                equipamentos: [{
                    nome: 'equipamentoHattori1',
                    quantidade: 1
                }, {
                    nome: 'equipamentoHattori2',
                    quantidade: 10
                }],
                capacidade: 200,
                funcionamento: '08:00-18:00'
            },
            salaReunioes = {
                nome: 'Sala de Reuniões',
                bloco: 'CQ/SPLab',
                imagens: [],
                equipamentos: [{
                    nome: 'equipamentoSPLAB1',
                    quantidade: 1
                }, {
                    nome: 'equipamentoSPLAB2',
                    quantidade: 220
                }],
                capacidade: 10,
                funcionamento: '08:00-12:00'
            };
        const locais = [auditorioSPLab, auditorioHattori, salaReunioes];

        this.carregarLocais = function () {
            return $q.when({data: locais.map(local => new Local(local))});
        }
    }]);
})();
