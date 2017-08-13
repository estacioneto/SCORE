/**
 * Sobrescrita do config do App específico para testes.
 */
angular.module('scoreApp').config(['$urlRouterProvider',
    function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    }]);
/**
 * Isto é uma issue conhecida. Para o karma conseguir rodar
 * os testes com diretiva ele precisa acessar o DOM via
 * isolatedScope. Entretanto, só fica habilitado isto
 * se o debug estiver ligado.
 */
angular.module('scoreApp').config(["$compileProvider", function($compileProvider) {
    $compileProvider.debugInfoEnabled(true);
}]);