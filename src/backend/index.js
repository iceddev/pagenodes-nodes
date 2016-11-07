const isoNodes = require('./isoNodes');

const browserNodes = [
  require("./core/espeak"),
  require("./io/camera"),
  require("./io/gpio"),
  require("./io/eventsource"),
  require("./storage/localdb"),
  require("./io/geolocate"),
  require('./io/vibrate'),
  require('./io/oscillator'),
  require("./io/gamepad"),
  require("./io/voicerec"),
  require('./io/accelerometer'),
  require('./storage/file'),
  require('./io/serial'),
  require('./io/midi'),
  require('./io/websensor')
];

module.exports = isoNodes.concat(browserNodes);
