(() => {
    'use strict';

    angular.module('reservaModulo', []).constant('TIPOS_RESERVA', {
        "Reunião": {
            corMd: {
                "background-color": "indigo-A700"
            },
            corRgb: 'rgb(48, 79, 254)',
            corTexto: ''
        },
        "Videoconferência": {
            corMd: {
                "background-color": "green-600"
            },
            corRgb: 'rgb(67, 160, 71)',
            corTexto: ''
        },
        "Assembleia": {
            corMd: {
                "background-color": "indigo-800"
            },
            corRgb: "rgb(40, 53, 147)",
            corTexto: ''
        },
        "Defesa": {
            corMd: {
                "background-color": "purple-400"
            },
            corRgb: "rgb(171, 71, 188)",
            corTexto: ''
        },
        "Palestra": {
            corMd: {
                "background-color": "red-600"
            },
            corRgb: "rgb(229, 57, 53)",
            corTexto: ''
        },
        "Outro": {
            corMd: {
                "background-color": "pink-400"
            },
            corRgb: "rgb(236,64,122)",
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