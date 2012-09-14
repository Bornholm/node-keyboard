/**
 * Read Linux Inputs in node.js
 * Author: William Petit (william.petit@lookingfora.name)
 *
 * Adapted from Tim Caswell's nice solution to read a linux joystick
 * http://nodebits.org/linux-joystick
 * https://github.com/nodebits/linux-joystick
 */

var fs = require('fs'),
    ref = require('ref'),
    EventEmitter = require('events').EventEmitter;

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


/**
 * Parse Input data
 */

function parse(input, buffer) {

  var event, value;

  if( buffer.readUInt16LE(16) === EV_KEY ) {

    event = {
      timeS: buffer.readUInt64LE(0),
      timeMS: buffer.readUInt64LE(8),
      keyCode: buffer.readUInt16LE(18)
    };

    event.keyId = findKeyID(event.keyCode);
    event.type = EVENT_TYPES[ buffer.readUInt32LE(20) ];

  }

  return event;
};

// Keys
var Keys = {};

Keys["KEY_ESC"] = 1;
Keys["KEY_1"] = 2;
Keys["KEY_2"] = 3;
Keys["KEY_3"] = 4;
Keys["KEY_4"] = 5;
Keys["KEY_5"] = 6;
Keys["KEY_6"] = 7;
Keys["KEY_7"] = 8;
Keys["KEY_8"] = 9;
Keys["KEY_9"] = 10;
Keys["KEY_0"] = 11;
Keys["KEY_MINUS"] = 12;
Keys["KEY_EQUAL"] = 13;
Keys["KEY_BACKSPACE"] = 14;
Keys["KEY_TAB"] = 15;
Keys["KEY_Q"] = 16;
Keys["KEY_W"] = 17;
Keys["KEY_E"] = 18;
Keys["KEY_R"] = 19;
Keys["KEY_T"] = 20;
Keys["KEY_Y"] = 21;
Keys["KEY_U"] = 22;
Keys["KEY_I"] = 23;
Keys["KEY_O"] = 24;
Keys["KEY_P"] = 25;
Keys["KEY_LEFTBRACE"] = 26;
Keys["KEY_RIGHTBRACE"] = 27;
Keys["KEY_ENTER"] = 28;
Keys["KEY_LEFTCTRL"] = 29;
Keys["KEY_A"] = 30;
Keys["KEY_S"] = 31;
Keys["KEY_D"] = 32;
Keys["KEY_F"] = 33;
Keys["KEY_G"] = 34;
Keys["KEY_H"] = 35;
Keys["KEY_J"] = 36;
Keys["KEY_K"] = 37;
Keys["KEY_L"] = 38;
Keys["KEY_SEMICOLON"] = 39;
Keys["KEY_APOSTROPHE"] = 40;
Keys["KEY_GRAVE"] = 41;
Keys["KEY_LEFTSHIFT"] = 42;
Keys["KEY_BACKSLASH"] = 43;
Keys["KEY_Z"] = 44;
Keys["KEY_X"] = 45;
Keys["KEY_C"] = 46;
Keys["KEY_V"] = 47;
Keys["KEY_B"] = 48;
Keys["KEY_N"] = 49;
Keys["KEY_M"] = 50;
Keys["KEY_COMMA"] = 51;
Keys["KEY_DOT"] = 52;
Keys["KEY_SLASH"] = 53;
Keys["KEY_RIGHTSHIFT"] = 54;
Keys["KEY_KPASTERISK"] = 55;
Keys["KEY_LEFTALT"] = 56;
Keys["KEY_SPACE"] = 57;
Keys["KEY_CAPSLOCK"] = 58;
Keys["KEY_F1"] = 59;
Keys["KEY_F2"] = 60;
Keys["KEY_F3"] = 61;
Keys["KEY_F4"] = 62;
Keys["KEY_F5"] = 63;
Keys["KEY_F6"] = 64;
Keys["KEY_F7"] = 65;
Keys["KEY_F8"] = 66;
Keys["KEY_F9"] = 67;
Keys["KEY_F10"] = 68;
Keys["KEY_NUMLOCK"] = 69;
Keys["KEY_SCROLLLOCK"] = 70;
Keys["KEY_KP7"] = 71;
Keys["KEY_KP8"] = 72;
Keys["KEY_KP9"] = 73;
Keys["KEY_KPMINUS"] = 74;
Keys["KEY_KP4"] = 75;
Keys["KEY_KP5"] = 76;
Keys["KEY_KP6"] = 77;
Keys["KEY_KPPLUS"] = 78;
Keys["KEY_KP1"] = 79;
Keys["KEY_KP2"] = 80;
Keys["KEY_KP3"] = 81;
Keys["KEY_KP0"] = 82;
Keys["KEY_KPDOT"] = 83;
Keys["KEY_ZENKAKUHANKAKU"] = 85;
Keys["KEY_102ND"] = 86;
Keys["KEY_F11"] = 87;
Keys["KEY_F12"] = 88;
Keys["KEY_RO"] = 89;
Keys["KEY_KATAKANA"] = 90;
Keys["KEY_HIRAGANA"] = 91;
Keys["KEY_HENKAN"] = 92;
Keys["KEY_KATAKANAHIRAGANA"] = 93;
Keys["KEY_MUHENKAN"] = 94;
Keys["KEY_KPJPCOMMA"] = 95;
Keys["KEY_KPENTER"] = 96;
Keys["KEY_RIGHTCTRL"] = 97;
Keys["KEY_KPSLASH"] = 98;
Keys["KEY_SYSRQ"] = 99;
Keys["KEY_RIGHTALT"] = 100;
Keys["KEY_HOME"] = 102;
Keys["KEY_UP"] = 103;
Keys["KEY_PAGEUP"] = 104;
Keys["KEY_LEFT"] = 105;
Keys["KEY_RIGHT"] = 106;
Keys["KEY_END"] = 107;
Keys["KEY_DOWN"] = 108;
Keys["KEY_PAGEDOWN"] = 109;
Keys["KEY_INSERT"] = 110;
Keys["KEY_DELETE"] = 111;
Keys["KEY_MUTE"] = 113;
Keys["KEY_VOLUMEDOWN"] = 114;
Keys["KEY_VOLUMEUP"] = 115;
Keys["KEY_POWER"] = 116;
Keys["KEY_KPEQUAL"] = 117;
Keys["KEY_PAUSE"] = 119;
Keys["KEY_KPCOMMA"] = 121;
Keys["KEY_HANGUEL"] = 122;
Keys["KEY_HANJA"] = 123;
Keys["KEY_YEN"] = 124;
Keys["KEY_LEFTMETA"] = 125;
Keys["KEY_RIGHTMETA"] = 126;
Keys["KEY_COMPOSE"] = 127;
Keys["KEY_STOP"] = 128;
Keys["KEY_AGAIN"] = 129;
Keys["KEY_PROPS"] = 130;
Keys["KEY_UNDO"] = 131;
Keys["KEY_FRONT"] = 132;
Keys["KEY_COPY"] = 133;
Keys["KEY_OPEN"] = 134;
Keys["KEY_PASTE"] = 135;
Keys["KEY_FIND"] = 136;
Keys["KEY_CUT"] = 137;
Keys["KEY_HELP"] = 138;
Keys["KEY_F13"] = 183;
Keys["KEY_F14"] = 184;
Keys["KEY_F15"] = 185;
Keys["KEY_F16"] = 186;
Keys["KEY_F17"] = 187;
Keys["KEY_F18"] = 188;
Keys["KEY_F19"] = 189;
Keys["KEY_F20"] = 190;
Keys["KEY_F21"] = 191;
Keys["KEY_F22"] = 192;
Keys["KEY_F23"] = 193;
Keys["KEY_F24"] = 194;
Keys["KEY_UNKNOWN"] = 240;

Keyboard.Keys = Keys;

/**
 * Find Key Id
 */

function findKeyID( keyCode ) {
  var key, value;
  for( key in Keys ) {
    if ( Keys.hasOwnProperty(key) ) {
      if( Keys[key] === keyCode ) {
        return key;
      }
    }
  }
}

module.exports = Keyboard;