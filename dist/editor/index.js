"use strict";

var isoNodes = require('./isoNodes');

var browserNodes = [require("./core/espeak"), require("./io/camera"), require("./io/eventsource"), require("./storage/localdb"), require("./io/geolocate"), require('./io/vibrate'), require('./io/oscillator'), require("./io/gamepad"), require("./io/voicerec"), require('./io/accelerometer'), require('./storage/file'), require('./io/serial'), require('./io/midi'), require('./io/websensor'), require('./io/bluetooth'), require("./io/nodebot-browser")];

module.exports = isoNodes.concat(browserNodes);