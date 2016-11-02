var expect = require('chai').expect;
var MessageBus = require('../src');
var i18n = require('../src/i18n');

describe('test method: off', function () {
  var key = 'test';
  var func = function () {};
  var keyError = new RegExp(i18n.keyError);

  it('remove appointed function.', function () {
    var mb = MessageBus();

    mb.on(key, func);
    expect(mb.get(key)).to.be.deep.equal({[key]:[func]});

    mb.off(key, func);
    expect(mb.get(key)).to.be.empty;
  })

  it('key must be string type.', function () {
    var mb = MessageBus();

    expect(function () {mb.off(null, func);}).to.throw(keyError);
    expect(function () {mb.off(undefined, func);}).to.throw(keyError);
    expect(function () {mb.off(true, func);}).to.throw(keyError);
    expect(function () {mb.off(false, func);}).to.throw(keyError);
    expect(function () {mb.off(1, func);}).to.throw(keyError);
    expect(function () {mb.off({}, func);}).to.throw(keyError);
    expect(function () {mb.off([], func);}).to.throw(keyError);
    expect(function () {mb.off('', func);}).to.throw(keyError);
  });

  it('RegExp can remove key directly.', function () {
    var mb = MessageBus();

    mb.on(key, func);
    expect(mb.get(key)).to.have.all.keys([key]);

    mb.off(/.*/, func);
    expect(mb.get(key)).to.be.empty;
  });

  it('RegExp can remove function for suited items.', function () {
    var mb = MessageBus();
    var localKey = 1 + key;
    var localFunc = function () {};

    mb.on(key, func);
    mb.on(key, localFunc);
    mb.on(localKey, func);

    mb.off(/.*test$/, func);

    expect(mb.get(key)).to.be.deep.equal({[key]: [localFunc]});
    expect(mb.get(localKey)).to.be.empty;
  });

  it('clear method is correct: no second parameter.', function () {
    var mb = MessageBus();
    var localFunc = function () {};

    mb.on(key, func);
    mb.on(key, localFunc);

    mb.off(key);

    expect(mb.get(key)).to.be.empty;
  });

  it('RegExp can clear suited items: no second parameter.', function () {
    var mb = MessageBus();
    var localKey = key + 1;
    var localFunc = function () {};

    mb.on(key, func);
    mb.on(localKey, func);
    mb.on(key, localFunc);
    mb.on(localKey, localFunc);

    mb.off(/.*/);

    expect(mb.get(key)).to.be.empty;
    expect(mb.get(localKey)).to.be.empty;
  });
});
