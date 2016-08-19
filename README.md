node-keyboard
=============

Quick & dirty keyboard keylogger for NodeJS & Linux

Inspired from http://nodebits.org/linux-joystick

Install
-------

```
npm install
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

See demo2.js

```javascript
var Keyboard = require('./keyboard.js');

var k = new Keyboard('event2'); // 'event2' is the file corresponding to my keyboard in /dev/input/
k.Lines(function(data){
    console.log(data);
});
```

Events

```javascript
{ 
  timeS: 1347572085, // Timestamp ( Seconds part )
  timeMS: 741381, // Timestamp ( Microseconds part )
  key: key: { code: 30, ascii: 'a', s_ascii: 'A', key: 'KEY_A' }, // Key Info /!\ Qwerty layout !
  type: 'keypress', // Event type
  dev: 'event2'  // Device
}
```

Licence
-------

MIT
