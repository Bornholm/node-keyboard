var Keyboard = require('./keyboard.js');

var k = new Keyboard('event2'); // 'event2' is the file corresponding to my keyboard in /dev/input/
k.Lines(function(data){
    console.log(data);
});