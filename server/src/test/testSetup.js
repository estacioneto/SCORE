/******************************************************
 *
 * Variáveis globais para testes.
 * Basta colocar {@code require('../testSetup');}
 * na primeira linha do teste
 *
 ******************************************************/

const assert = require('assert'),
    chai = require('chai').use(require('chai-as-promised')),
    sinon = require('sinon'),
    clone = require('clone'),
    request = require('supertest'),
    mockery = require('mockery');
const expect = chai.expect;
const _ = require('../main/util/util');

const TEST_DB = 'SCORE-TESTDB';

Object.assign(global, {
    assert,
    chai,
    sinon,
    clone,
    request,
    mockery,
    expect,
    _,
    TEST_DB
});
