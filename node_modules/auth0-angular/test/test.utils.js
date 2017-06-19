/*exported initAuth0 */
function executeInConfigBlock(cb, includes) {
  var fakeModule = angular.module('fakeModule', []);
  var modulesToInclude = (includes ? includes : ['auth0']).concat('fakeModule');
  fakeModule.config(cb);

  module.apply(null, modulesToInclude);
}

function initAuth0() {
  executeInConfigBlock(function (authProvider) {
    authProvider.init({
      domain: 'my-domain.auth0.com',
      clientID: 'my-client-id',
      callbackURL: 'http://localhost/callback'
    });
  });
}
