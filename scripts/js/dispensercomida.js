//dispenser comida
var b = require('bonescript');
var dispenser = "P9_23";

var state = 0;

b.pinMode(dispenser, 'out');

toggleDispenser = function() {
    state = state ? 0 : 1;
    b.digitalWrite(dispenser, state);
};

timer = setInterval(toggleDispenser, 1000);

stopTimer = function() {
    clearInterval(timer);
    b.digitalWrite(dispenser,0);
};

setTimeout(stopTimer, 5000);
