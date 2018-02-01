"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');

function init(PN) {
  var MidiInNode = function (_PN$Node) {
    _inherits(MidiInNode, _PN$Node);

    function MidiInNode(n) {
      _classCallCheck(this, MidiInNode);

      var _this = _possibleConstructorReturn(this, (MidiInNode.__proto__ || Object.getPrototypeOf(MidiInNode)).call(this, n));

      var node = _this;
      node.deviceId = n.deviceId;

      node.status({ fill: "yellow", shape: "dot", text: "connecting..." });

      // request MIDI access
      if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({
          sysex: false
        }).then(onMIDISuccess, onMIDIFailure);
      } else {
        node.error("No MIDI support in your browser.");
      }

      // midi functions
      function onMIDISuccess(midiAccess) {
        // when we get a succesful response, run this code
        node.midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status

        var inputs = Array.from(node.midi.inputs.values());
        console.log('inputs', inputs);

        _.forEach(inputs, function (input) {
          if (!node.deviceId) {
            node.device = input;
            return false;
          } else if (node.deviceId == input.id) {
            node.device = input;
            return false;
          }
        });

        if (node.device) {
          node.status({ fill: "green", shape: "dot", text: "id: " + node.device.id });
          node.device.onmidimessage = function (message) {
            var data = message.data; // this gives us our [command/channel, note, velocity] data.
            console.log('MIDI data in', data); // MIDI data [144, 63, 73]
            node.send({ topic: 'midi', payload: data });
          };
        } else {
          node.status({ fill: "red", shape: "dot", text: "disconnected" });
        }
      }

      function onMIDIFailure(error) {
        // when we get a failed response, run this code
        node.error("No access to MIDI devices or your browser doesn't support WebMIDI API" + error);
      }

      node.on('close', function () {
        if (node.device) {
          node.device.onmidimessage = null;
          node.device.close();
        }
      });

      return _this;
    }

    return MidiInNode;
  }(PN.Node);

  MidiInNode.groupName = 'midi';
  PN.nodes.registerType("midi in", MidiInNode);

  var MidiOutNode = function (_PN$Node2) {
    _inherits(MidiOutNode, _PN$Node2);

    function MidiOutNode(n) {
      _classCallCheck(this, MidiOutNode);

      var _this2 = _possibleConstructorReturn(this, (MidiOutNode.__proto__ || Object.getPrototypeOf(MidiOutNode)).call(this, n));

      var node = _this2;
      node.deviceId = n.deviceId;

      node.status({ fill: "yellow", shape: "dot", text: "connecting..." });

      // request MIDI access
      if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({
          sysex: true
        }).then(onMIDISuccess, onMIDIFailure);
      } else {
        node.error("No MIDI support in your browser.");
      }

      // midi functions
      function onMIDISuccess(midiAccess) {
        // when we get a succesful response, run this code
        node.midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status

        var outputs = Array.from(node.midi.outputs.values());
        console.log('outputs', outputs);

        _.forEach(outputs, function (output) {
          if (!node.deviceId) {
            node.device = output;
            return false;
          } else if (node.deviceId == output.id) {
            node.device = output;
            return false;
          }
        });

        if (node.device) {
          node.status({ fill: "green", shape: "dot", text: "id: " + node.device.id });

          node.on('input', function (msg) {
            node.device.send(new Buffer(msg.payload));
          });
        } else {
          node.status({ fill: "red", shape: "dot", text: "disconnected" });
        }
      }

      function onMIDIFailure(error) {
        // when we get a failed response, run this code
        node.error("No access to MIDI devices or your browser doesn't support WebMIDI API" + error);
      }

      node.on('close', function () {
        if (node.device) {
          node.device.onmidimessage = null;
          node.device.close();
        }
      });

      return _this2;
    }

    return MidiOutNode;
  }(PN.Node);

  MidiOutNode.groupName = 'midi';
  PN.nodes.registerType("midi out", MidiOutNode);

  function listIDs(msg, type) {
    // request MIDI access
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({
        sysex: !!msg.params[0]
      }).then(function (midi) {
        var vals;
        if (type === 'inputs') {
          vals = Array.from(midi.inputs.values());
        } else {
          vals = Array.from(midi.outputs.values());
        }
        msg.reply(vals.map(function (val) {
          return val.id;
        }));
      }, function (err) {
        msg.reply([]);
      });
    } else {
      msg.reply([]);
    }
  }

  PN.events.on('rpc_midi/listInputIDs', function (msg) {
    console.log('rpc_midi/listInputIDs', msg);
    listIDs(msg, 'inputs');
  });

  PN.events.on('rpc_midi/listOutputIDs', function (msg) {
    console.log('rpc_midi/listOutputIDs', msg);
    listIDs(msg, 'outputs');
  });
}

module.exports = init;