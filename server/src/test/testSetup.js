/*******************************************************************
 * Setup para testes. Evita vários imports nos arquivos de teste.
 * Ao invés disso, basta importar o arquivo no início do teste.
 * Adiciona variáveis de teste importantes ao escopo global.
 *
 * @example
 * import '../testSetup';
 *
 * @author Estácio Pereira
 *******************************************************************/

import assert from 'assert';
import Chai from 'chai';
import chai_as_promised from 'chai-as-promised';
import sinon from 'sinon';
import clone from 'clone';
import request from 'supertest';
import _ from 'lodash';
import 'babel-polyfill';

const expect = Chai.expect;
const chai = Chai.use(chai_as_promised);
Object.assign(global, {
    assert,
    chai,
    sinon,
    clone,
    request,
    expect,
    _
});
