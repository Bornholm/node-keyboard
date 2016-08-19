/**
 * Read Linux Inputs in node.js
 * Author: William Petit (william.petit@lookingfora.name)
 *
 * Adapted from Tim Caswell's nice solution to read a linux joystick
 * http://nodebits.org/linux-joystick
 * https://github.com/nodebits/linux-joystick
 */
var fs = require('fs');
var key = require('./keys.js')
var EventEmitter = require('events').EventEmitter;

var EV_KEY = 1,
    EVENT_TYPES = ['keyup','keypress','keydown'];
   

function Keyboard(dev) {
  this.wrap('onOpen');
  this.wrap('onRead');
  this.dev = dev;
  this.bufferSize = 24;
  this.buf = new Buffer(this.bufferSize);
  fs.open('/dev/input/' + this.dev, 'r', this.onOpen);
}

Keyboard.prototype = Object.create(EventEmitter.prototype, {
  constructor: {value: Keyboard}
});

Keyboard.prototype.wrap = function(name) {
  var self = this;
  var fn = this[name];
  this[name] = function (err) {
    if (err) return self.emit('error', err);
    return fn.apply(self, Array.prototype.slice.call(arguments, 1));
  };
};

Keyboard.prototype.onOpen = function(fd) {
  this.fd = fd;
  this.startRead();
};

Keyboard.prototype.startRead = function() {
  fs.read(this.fd, this.buf, 0, this.bufferSize, null, this.onRead);
};

Keyboard.prototype.onRead = function(bytesRead) {
  var event = parse(this, this.buf);
  if( event ) {
    event.dev = this.dev;
    this.emit(event.type, event);
  }
  if (this.fd) this.startRead();
};

Keyboard.prototype.close = function(callback) {
  fs.close(this.fd, (function(){console.log(this);}));
  this.fd = undefined;
};

Keyboard.prototype.Lines = function(callback) {
  var line = [];
  var endLine = function () {
    callback(toLine(line));
    line = [];
  }
  this.on('keypress', function(data){
    if(!data || !data['key']) return;
    if (data['key']['code']==28)
      return endLine();
    else
      line.push(data);
  });
};


/**
 * Parse Input data
 */

function parse(input, buffer) {

  var event, value;

  if( buffer.readUInt16LE(16) === EV_KEY ) {

    event = {
      timeS: buffer.readUInt32LE(0) + buffer.readUInt32LE(4),
      timeMS: buffer.readUInt32LE(8) + buffer.readUInt32LE(12),
    };
    var keyCode = buffer.readUInt16LE(18)
    event.key = findKeyID(keyCode);
    event.type = EVENT_TYPES[ buffer.readUInt32LE(20) ];

  }

  return event;
};


Keyboard.Keys = (new key()).keys;

/**
 * Find Key Id
 */

function findKeyID( keyCode ) {
  var key;
  for( key in Keyboard.Keys ) {
    if ( Keyboard.Keys.hasOwnProperty(key) ) {
      if( Keyboard.Keys[key]['code'] === keyCode ) {
        Keyboard.Keys[key]['key'] = key;
        return Keyboard.Keys[key];
      }
    }
  }
}

function toLine(events){
  var res = '',shift = 0;
  for(var e in events){
    if(events[e]['key']['key'] == 'KEY_LEFTSHIFT' || events[e]['key']['key'] == 'KEY_RIGHTSHIFT') shift = 1;
    else{
      if(shift && events[e]['key']['s_ascii']){
        res += events[e]['key']['s_ascii'];
        shift = 0;
      }
      else if(events[e]['key']['ascii']) {
        res += events[e]['key']['ascii'];
        shift = 0;
      }
    }
  }
  return res;
}

module.exports = Keyboard;