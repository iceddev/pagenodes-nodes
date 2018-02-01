'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var _ = require('lodash');

  global.AudioContext = global.AudioContext || global.webkitAudioContext;

  var context;

  if (global.AudioContext) {
    context = new AudioContext();
  }

  var OscillatorNode = function (_PN$Node) {
    _inherits(OscillatorNode, _PN$Node);

    function OscillatorNode(n) {
      _classCallCheck(this, OscillatorNode);

      var _this = _possibleConstructorReturn(this, (OscillatorNode.__proto__ || Object.getPrototypeOf(OscillatorNode)).call(this, n));

      _this.duration = parseInt(n.duration, 10);
      _this.frequency = parseInt(n.frequency, 10);
      _this.shape = n.shape;

      _this.console = n.console;
      _this.active = n.active === null || typeof n.active === 'undefined' || n.active;
      var node = _this;

      node.oscillators = {};

      node.on('input', function (msg) {

        if (!context) {
          node.error('This browser does not support WebAudio');
          return;
        }

        if (node.active) {

          var frequency = parseInt(msg.frequency, 10) || node.frequency || 440;
          var duration = parseInt(msg.duration, 10);
          if (duration != 0 && !duration) {
            duration = node.duration || 500;
          }

          if (duration == 0) {
            if (node.oscillators[frequency]) {
              node.oscillators[frequency].oscillator.stop(0);
              clearTimeout(node.oscillators[frequency].timeout);
              // console.log('cleared osc', node.oscillators[frequency]);
              delete node.oscillators[frequency];
            }
            return;
          }

          var oscillator = context.createOscillator();
          oscillator.frequency.value = frequency;

          if (Array.isArray(msg.realTable)) {
            var real = new Float32Array(msg.realTable);
            var imag;
            if (msg.imagTable && Array.isArray(msg.imagTable)) {
              imag = new Float32Array(msg.imagTable);
            } else {
              imag = new Float32Array(real.length);
            }
            var pWave = context.createPeriodicWave(real, imag);
            oscillator.setPeriodicWave(pWave);
          } else {
            oscillator.type = msg.shape || node.shape || 'sine';
          }

          oscillator.connect(context.destination);
          oscillator.start(0);

          var timeout = setTimeout(function () {
            if (node.oscillators[frequency]) {
              node.oscillators[frequency].oscillator.stop(0);
              delete node.oscillators[frequency];
            }
          }, duration);

          node.oscillators[frequency] = { timeout: timeout, oscillator: oscillator };
        }
      });

      node.on('close', function () {
        _.forEach(node.oscillators, function (osc) {
          osc.oscillator.stop(0);
        });
      });

      return _this;
    }

    return OscillatorNode;
  }(PN.Node);

  PN.nodes.registerType('oscillator', OscillatorNode);

  PN.events.on('rpc_oscillator', function (data) {
    var node = PN.nodes.getNode(data.params[0]);
    var state = data.params[1];
    if (node !== null && typeof node !== 'undefined') {
      if (state === 'enable') {
        node.active = true;
        data.reply(200);
      } else if (state === 'disable') {
        node.active = false;
        _.forEach(node.oscillators, function (osc) {
          clearTimeout(osc.timeout);
          osc.oscillator.stop(0);
        });
        data.reply(201);
      } else {
        data.reply(404);
      }
    } else {
      data.reply(404);
    }
  });
};