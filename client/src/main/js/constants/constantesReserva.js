(() => {
    'use strict';

    angular.module('reservaModulo', []).constant('TIPOS_RESERVA', {
        REUNIAO: "Reuniao",
        VIDEO_CONFERENCIA: "Video-conferencia",
        ASSEMBLEIA: "Assembleia",
        DEFESA: "Defesa"
    });
})();