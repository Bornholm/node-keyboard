node-keyboard
=============

Quick & dirty keyboard keylogger for NodeJS & Linux

Inspired from http://nodebits.org/linux-joystick

Install
-------

```
npm install git+https://github.com/Bornholm/node-keyboard.git
```

Usage
-----

See demo.js

```javascript
var Keyboard = require('./keyboard.js');

var k = new Keyboard('event2'); // 'event2' is the file corresponding to my keyboard in /dev/input/
k.on('keyup', console.log);
k.on('keydown', console.log);
k.on('keypress', console.log);
k.on('error', console.error);
```

Events

```javascript
{ 
  timeS: 1347572085, // Timestamp ( Seconds part )
  timeMS: 741381, // Timestamp ( Microseconds part )
  keyCode: 17, // Keyboard code
  keyId: 'KEY_W', // Key ID /!\ Qwerty layout !
  type: 'keypress', // Event type
  dev: 'event2'  // Device
}
```

Licence
-------

MIT
