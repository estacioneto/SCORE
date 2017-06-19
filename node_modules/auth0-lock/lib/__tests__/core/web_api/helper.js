'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _helper = require('core/web_api/helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('webAuthOverrides', function () {
  it('should return overrides if any field is compatible with WebAuth', function () {
    (0, _expect2.default)((0, _helper.webAuthOverrides)({ __tenant: 'tenant1', __token_issuer: 'issuer1' })).to.eql({
      __tenant: 'tenant1',
      __token_issuer: 'issuer1'
    });
  });

  it('should omit overrides that are not compatible with WebAuth', function () {
    (0, _expect2.default)((0, _helper.webAuthOverrides)({ __tenant: 'tenant1', __token_issuer: 'issuer1', backgroundColor: 'blue' })).to.eql({ __tenant: 'tenant1', __token_issuer: 'issuer1' });
  });

  it('should return null if no fields are compatible with WebAuth', function () {
    (0, _expect2.default)((0, _helper.webAuthOverrides)({ backgroundColor: 'blue' })).to.not.be.ok();
  });
});
