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
    should = require('should'),
    clone = require('clone'),
    request = require('supertest'),
    mockery = require('mockery');
const expect = chai.expect;
const _ = require('../main/util/util');

const TEST_DB = 'SCORE-TESTDB',
    TEST_TOKEN = process.env.SCORE_TEST_TOKEN;

Object.assign(global, {
    assert,
    chai,
    sinon,
    should,
    clone,
    request,
    mockery,
    expect,
    _,
    TEST_DB,
    TEST_TOKEN
});
