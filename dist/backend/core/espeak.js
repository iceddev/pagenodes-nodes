'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var EspeakNode = function (_PN$Node) {
    _inherits(EspeakNode, _PN$Node);

    function EspeakNode(n) {
      _classCallCheck(this, EspeakNode);

      var _this = _possibleConstructorReturn(this, (EspeakNode.__proto__ || Object.getPrototypeOf(EspeakNode)).call(this, n));

      _this.variant = n.variant;

      _this.console = n.console;
      _this.active = n.active === null || typeof n.active === 'undefined' || n.active;
      var node = _this;

      _this.on('input', function (msg) {

        if (this.active) {
          sendEspeak({ id: this.id, name: this.name, topic: msg.topic, msg: msg, variant: msg.variant || node.variant });
        }
      });
      return _this;
    }

    return EspeakNode;
  }(PN.Node);

  PN.nodes.registerType('espeak', EspeakNode);

  function sendEspeak(msg) {
    PN.comms.publish('espeak', msg);
  }

  PN.events.on('rpc_espeak', function (data) {
    var node = PN.nodes.getNode(data.params[0]);
    var state = data.params[1];
    if (node !== null && typeof node !== 'undefined') {
      if (state === 'enable') {
        node.active = true;
        data.reply(200);
      } else if (state === 'disable') {
        node.active = false;
        data.reply(201);
      } else {
        data.reply(404);
      }
    } else {
      data.reply(404);
    }
  });
};