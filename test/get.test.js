var expect = require('chai').expect;
var MessageBus = require('../src');
var i18n = require('../src/i18n');

describe('test method: get', function () {
  var key = 'test';
  var func = function () {};
  var keyError = new RegExp(i18n.keyError);

  it('first is emtpy.', function () {
    var mb = MessageBus();

    expect(mb.get(key)).to.be.empty;
  });

  it('get by key.', function () {
    var mb = MessageBus();
    var localKey = key + 1;

    mb.on(key, func);
    mb.on(localKey, func);

    expect(mb.get(key)).to.have.all.keys([key]);
    expect(mb.get(localKey)).to.have.all.keys([localKey]);
  });

  it('get all subscribe.', function () {
    var mb = MessageBus();
    var localKey = key + 1;

    mb.on(key, func);
    mb.on(localKey, func);

    expect(mb.get(/.*/)).to.have.all.keys([key, localKey]);
  });
});
