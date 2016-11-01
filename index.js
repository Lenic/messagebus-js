var MessageBox = require('./src');
var _ = require('underscore');

var mb = MessageBox();

function abc() {
  console.log(_.toArray(arguments));
}

mb.on('abc', abc);

mb.publish(/abc/, 1, 2, 3);

mb.off(/.*/, abc);

mb.publish(/abc/, 1, 2, 3);
