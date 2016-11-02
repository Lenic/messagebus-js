var expect = require('chai').expect;
var MessageBox = require('../src');
var i18n = require('../src/i18n');

describe('test method: on', function () {
  var key = 'test';
  var func = function () {};
  var keyError = new RegExp(i18n.keyError);

  it('add new function.', function () {
    var mb = MessageBox();

    mb.on(key, func);

    expect(mb.get(key)).to.be.deep.equal({[key]:[func]});
  })

  it('key must be string type.', function () {
    var mb = MessageBox();

    expect(function () {mb.on(null, func);}).to.throw(keyError);
    expect(function () {mb.on(undefined, func);}).to.throw(keyError);
    expect(function () {mb.on(true, func);}).to.throw(keyError);
    expect(function () {mb.on(false, func);}).to.throw(keyError);
    expect(function () {mb.on(1, func);}).to.throw(keyError);
    expect(function () {mb.on({}, func);}).to.throw(keyError);
    expect(function () {mb.on([], func);}).to.throw(keyError);
    expect(function () {mb.on('', func);}).to.throw(keyError);
  });

  it('RegExp can not add key directly.', function () {
    var mb = MessageBox();

    mb.on(/abc/, func);
    expect(mb.get(key)).to.be.empty;
  });

  it('RegExp can add key to existent items.', function () {
    var mb = MessageBox();
    var localFunc = function () {};

    mb.on(key, func);
    mb.on(/.*test$/, localFunc);

    expect(mb.get(key)).to.be.deep.equal({[key]: [func, localFunc]});
  });

  it('can not add same function twice.', function () {
    var mb = MessageBox();

    mb.on(key, func);
    mb.on(key, func);

    expect(mb.get(key)).to.be.deep.equal({[key]: [func]});
  });
});
