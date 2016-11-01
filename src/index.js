var _ = require('underscore');
var comparers = require('./comparers');
var i18n = require('./i18n');

function MessageBus() {
  if (!(this instanceof MessageBus)) {
    return new MessageBus();
  }

  this.comparers = _.map(comparers, function (v, k) {
    return k;
  });

  this.subscribers = {};
};

MessageBus.prototype.addComparer = function (func) {
  if (!func) {
    throw new Error(notFunc);
  }

  this.comparers.push(func);
};

MessageBus.prototype.removeComparer = function (func) {
  if (!func) {
    throw new Error(notFunc);
  }

  var index = _.indexOf(this.comparers, func);
  if (index >= 0) {
    this.comparers = this.comparers.slice(0, index).concat(this.comparers.slice(index + 1));
  }

  return index >= 0;
};

MessageBus.prototype.get = function (key) {
  if (!key || (typeof key !== 'string' && !(key instanceof RegExp))) {
    throw new Error(keyError);
  }

  return _.chain(this.subscribers)
          .pairs()
          .filter(function (v) {
            return _.some(comparers, function (comparer) {
              return comparer(key, v[0]);
            });
          })
          .object()
          .value();
};

MessageBus.prototype.on = function (key, func) {
  if (!func) {
    throw new Error(notFunc);
  }

  var subscribers = this.get(key);
  if (!_.keys(subscribers).length && !(key instanceof RegExp)) {
    subscribers = {
      [key]: []
    };
  }

  if (!_.keys(subscribers).length) {
    return;
  }

  var modified = _.chain(subscribers)
                  .map(function (v, k) {
                    return [k, v.concat(func)];
                  })
                  .object()
                  .value();
  this.subscribers = _.extend({}, this.subscribers, modified);
};

MessageBus.prototype.off = function (key, func) {
  if (!func) {
    throw new Error(notFunc);
  }

  var subscribers = this.get(key);
  var modified = _.chain(subscribers)
                  .map(function (v, k) {
                    var index = _.indexOf(v, func);
                    if (index >= 0) {
                      return [
                        k,
                        v.slice(0, index).concat(v.slice(index + 1))
                      ];
                    } else {
                      return [k, v];
                    }
                  })
                  .object()
                  .value();
  var newSubscribers = _.extend({}, this.subscribers, modified);

  this.subscribers = _.chain(newSubscribers)
                      .pairs()
                      .filter((k, v) => v.length)
                      .object()
                      .value();
};

MessageBus.prototype.publish = function (key) {
  if (!key || (typeof key !== 'string' && !(key instanceof RegExp))) {
    throw new Error(keyError);
  }

  var args = _.toArray(arguments).slice(1);

  var subscribers = this.get(key);
  _.each(subscribers, function (events) {
    _.each(events, function (e) {
      e.apply(null, args);
    })
  })
};

module.exports = MessageBus;
