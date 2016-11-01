exports.default = function (left, right) {
  return left === right;
};

exports.ignorecase = function (left, right) {
  var midResult = left === right;
  if (midResult) {
    return true;
  }

  var leftType = typeof left;
  var rightType = typeof right;

  if (leftType === rightType && leftType === 'string') {
    return left.toLowerCase() === right.toLowerCase();
  }

  return false;
};

exports.reg = function (regexp, pattern) {
  if (!(regexp instanceof RegExp)) {
    return false;
  }

  return regexp.test(pattern);
};
