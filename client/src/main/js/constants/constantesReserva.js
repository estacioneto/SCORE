(() => {
    'use strict';

    angular.module('reservaModulo', []).constant('TIPOS_RESERVA', {
        "Reunião": {
            mdTheme: 'reuniao',
            corMd: {
                "background-color": "indigo-A700"
            },
            corRgb: 'rgb(48, 79, 254)',
            corTexto: ''
        },
        "Videoconferência": {
            mdTheme: 'videoconferencia',
            corMd: {
                "background-color": "green-600"
            },
            corRgb: 'rgb(67, 160, 71)',
            corTexto: ''
        },
        "Assembleia": {
            mdTheme: 'assembleia',
            corMd: {
                "background-color": "teal-700"
            },
            corRgb: "rgb(0, 121, 107)",
            corTexto: ''
        },
        "Defesa": {
            mdTheme: 'defesa',
            corMd: {
                "background-color": "purple-400"
            },
            corRgb: "rgb(171, 71, 188)",
            corTexto: ''
        },
        "Palestra": {
            mdTheme: 'palestra',
            corMd: {
                "background-color": "red-A700"
            },
            corRgb: "rgb(213, 0, 0)",
            corTexto: ''
        },
        "Outro": {
            mdTheme: 'outro',
            corMd: {
                "background-color": "amber-700"
            },
            corRgb: "rgb(255, 160, 0)",
            corTexto: ''
        }
    })
    .constant('COR_RESERVA_PASSADA', {
        corMd: {
            "background-color": "grey-400"
        },
        corRgb: "rgb(189, 189, 189)",
        corTexto: ''

    });
})();