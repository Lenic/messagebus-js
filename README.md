## MessageBus.js

**MessageBus.js** is a compatible tookit for javascript, current version is first version: 1.0.0.

### Usage

```bash
$ npm install --save messagebus-js
```

### Run test

```bash
$ npm run test
```

## Example

```js
var mb = MessageBox();
var func = function (arg) {
  console.log('func', arg);
};

// add new subscriber.
mb.on('test', func);

// publish a message, will be show log on console.
mb.publish('test', Date.now());

// remove appointed subscriber.
mb.off('test', func);
// can remove use RegExp.
// mb.off(/test/, func);
// and remove all for only one parameter.
// mb.off('test');
// mb.off(/test/);

// test publish, but no show on console.
mb.publish('test', 123);
```

For more, see the unit test.
