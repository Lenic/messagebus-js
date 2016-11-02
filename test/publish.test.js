var expect = require('chai').expect;
var MessageBus = require('../src');

describe('test method: publish', function () {
  it('test basic publish.', function () {
    var mb = MessageBus();
    var key = 'test';

    mb.on(key, function (arg) {
      return arg + 1;
    });

    expect(mb.publish(key, 2)).to.be.equal(3);
  });

  it('test chained processor.', function () {
    var mb = MessageBus();
    var key = 'test';

    mb.on(key, function (arg) {
      return arg + 1;
    });
    mb.on(key, function (arg) {
      return arg * 2;
    });

    expect(mb.publish(key, 2)).to.be.equal(6);
  });

  it('test publish without return.', function () {
    var mb = MessageBus();
    var key = 'test';

    mb.on(key, function (arg) {
      var a = arg + 1;
    });

    expect(mb.publish(key, 2)).to.be.equal(undefined);
  });

  it('test multiple publish.', function () {
    var mb = MessageBus();
    var key = 'test';

    mb.on(1 + key, function (arg) {
      return arg + 1;
    });
    mb.on(2 + key, function (arg) {
      return arg * 2;
    });

    expect(mb.publish(new RegExp(key), 2)).to.be.deep.equal({
      '1test': 3,
      '2test': 4
    });
  });

  it('test multiple publish without return.', function () {
    var mb = MessageBus();
    var key = 'test';

    mb.on(1 + key, function (arg) {
      var a = arg + 1;
    });
    mb.on(2 + key, function (arg) {
      var b = arg * 2;
    });

    expect(mb.publish(new RegExp(key), 2)).to.be.deep.equal({
      '1test': undefined,
      '2test': undefined
    });
  });
});
