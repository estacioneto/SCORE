(() => {
    'use strict';

    angular.module('localModulo').service('LocaisService', ['$http', '$q', 'Local', function ($http, $q, Local) {

        // TODO: Implementar lógica inteira, @author Estácio Pereira.
        const auditorioSPLab = {
                _id: 1,
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
                funcionamento: '08001800'
            },
            auditorioHattori = {
                _id: 2,
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
                funcionamento: '08001800'
            },
            salaReunioes = {
                _id: 10,
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
                funcionamento: '08001200'
            };
        const locais = [auditorioSPLab, auditorioHattori, salaReunioes];

        this.carregarLocais = function () {
            return $q.when({data: locais.map(local => new Local(local))});
        };

        this.carregarLocal = function (id) {
            return $q.when({data: _.find(locais, local => local._id === id)});
        };
    }]);
})();
