var _ = require('underscore');
var comparers = require('./comparers');
var i18n = require('./i18n');

function MessageBus() {
  if (!(this instanceof MessageBus)) {
    return new MessageBus();
  }

  this.comparers = _.map(comparers, function (v, k) {
    return v;
  });

  this.subscribers = {};
};

MessageBus.prototype.get = function (key) {
  if (!key || (typeof key !== 'string' && !(key instanceof RegExp))) {
    throw new Error(i18n.keyError);
  }

  return _.chain(this.subscribers)
          .pairs()
          .filter(function (v) {
            return _.some(this.comparers, function (comparer) {
              return comparer(key, v[0]);
            });
          }, this)
          .object()
          .value();
};

MessageBus.prototype.on = function (key, func) {
  if (func && !_.isFunction(func)) {
    throw new Error(i18n.notFunc);
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
                    if (_.indexOf(v, func) === -1) {
                      return [k, v.concat(func)];
                    }

                    return [k, v];
                  })
                  .object()
                  .value();
  this.subscribers = _.extend({}, this.subscribers, modified);
};

MessageBus.prototype.off = function (key, func) {
  if (func && !_.isFunction(func)) {
    throw new Error(i18n.notFunc);
  }

  var subscribers = this.get(key);
  var modified = _.chain(subscribers)
                  .map(function (v, k) {
                    if (!func) {
                      return [k, []];
                    }

                    var index = _.indexOf(v, func);
                    if (index >= 0) {
                      return [k, v.slice(0, index).concat(v.slice(index + 1))];
                    } else {
                      return [k, v];
                    }
                  })
                  .object()
                  .value();
  var newSubscribers = _.extend({}, this.subscribers, modified);

  this.subscribers = _.chain(newSubscribers)
                      .pairs()
                      .filter((v) => v[1].length)
                      .object()
                      .value();
};

MessageBus.prototype.publish = function (key) {
  if (!key || (typeof key !== 'string' && !(key instanceof RegExp))) {
    throw new Error(i18n.keyError);
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
