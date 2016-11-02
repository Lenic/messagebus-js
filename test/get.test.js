var expect = require('chai').expect;
var MessageBox = require('../src');
var i18n = require('../src/i18n');

describe('test method: get', function () {
  var key = 'test';
  var func = function () {};
  var keyError = new RegExp(i18n.keyError);

  it('first is emtpy.', function () {
    var mb = MessageBox();

    expect(mb.get(key)).to.be.empty;
  });

  it('get by key.', function () {
    var mb = MessageBox();
    var localKey = key + 1;

    mb.on(key, func);
    mb.on(localKey, func);

    expect(mb.get(key)).to.have.all.keys([key]);
    expect(mb.get(localKey)).to.have.all.keys([localKey]);
  });

  it('get all subscribe.', function () {
    var mb = MessageBox();
    var localKey = key + 1;

    mb.on(key, func);
    mb.on(localKey, func);

    expect(mb.get(/.*/)).to.have.all.keys([key, localKey]);
  });
});
