'use strict';

/******************************************************
 *
 * Variáveis globais para testes.
 * Basta colocar {@code require('../testSetup');}
 * na primeira linha do teste
 *
 ******************************************************/

const assert = require('assert'),
    chai = require('chai'),
    sinon = require('sinon'),
    should = require('should'),
    clone = require('clone'),
    mockery = require('mockery');
const expect = chai.expect;
const _ = require('../main/util/util');

const TEST_DB = 'SCORE-TESTDB';

Object.assign(global, {
    assert,
    chai,
    sinon,
    should,
    clone,
    mockery,
    expect,
    _,
    TEST_DB
});

console.log('q');