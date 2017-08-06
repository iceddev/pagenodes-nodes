const isoNodes = require('./isoNodes');

const browserNodes = [
  require("./core/function-browser"),
  require("./core/espeak"),
  require("./io/camera"),
  require('./io/lib/nodebot-browser'),
  require("./io/eventsource"),
  require("./storage/localdb"),
  require("./io/geolocate"),
  require('./io/vibrate'),
  require('./io/oscillator'),
  require("./io/gamepad"),
  require("./io/voicerec"),
  require('./io/accelerometer'),
  require('./storage/file'),
  require('./io/midi'),
  require('./io/websensor'),
  require('./io/bluetooth'),
  require('./io/shape'),
  require('./io/image'),
  require('./io/serialconnection-browser'),
];

module.exports = isoNodes.concat(browserNodes);
