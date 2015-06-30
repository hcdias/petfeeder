//dispenser agua
var b = require('bonescript');
var dispenser = "P9_12";

var state = 1;

b.pinMode(dispenser, 'out');

b.digitalWrite(dispenser, state);

stopDispenser = function() {
    b.digitalWrite(dispenser,0);
};

setTimeout(stopDispenser, 8000);
