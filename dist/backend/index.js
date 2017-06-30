"use strict";

var isoNodes = require('./isoNodes');

var browserNodes = [require("./core/function-browser"), require("./core/espeak"), require("./io/camera"), require('./io/lib/nodebot-browser'), require("./io/eventsource"), require("./storage/localdb"), require("./io/geolocate"), require('./io/vibrate'), require('./io/oscillator'), require("./io/gamepad"), require("./io/voicerec"), require('./io/accelerometer'), require('./storage/file'), require('./io/serial'), require('./io/midi'), require('./io/websensor'), require('./io/bluetooth')];

module.exports = isoNodes.concat(browserNodes);