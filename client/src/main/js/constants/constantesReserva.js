(() => {
    'use strict';

    angular.module('reservaModulo', []).constant('TIPOS_RESERVA', {
        "Reunião": {
            corMd: {
                "background-color": "green-800"
            },
            corRgb: 'rgb(46, 125, 50)',
            corTexto: ''
        },
        "Video-conferência": {
            corMd: {
                "background-color": "red"
            },
            corRgb: 'rgb(255, 82, 82)',
            corTexto: ''
        },
        "Assembléia": {
            corMd: {
                "background-color": "blue"
            },
            corRgb: "rgb(68, 138, 255)",
            corTexto: ''
        },
        "Defesa": {
            corMd: {
                "background-color": "purple"
            },
            corRgb: "rgb(224, 64, 251)",
            corTexto: ''
        }
    });
})();