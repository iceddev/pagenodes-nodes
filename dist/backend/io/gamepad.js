'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var GamepadNode = function (_PN$Node) {
    _inherits(GamepadNode, _PN$Node);

    function GamepadNode(config) {
      _classCallCheck(this, GamepadNode);

      var _this = _possibleConstructorReturn(this, (GamepadNode.__proto__ || Object.getPrototypeOf(GamepadNode)).call(this, config));

      var node = _this;
      var controllerId = parseInt(config.controllerId);
      var refreshInterval = parseInt(config.refreshInterval);
      node.onlyButtonChanges = !!config.onlyButtonChanges;
      node.roundAxes = !!config.roundAxes;

      console.log(navigator.getGamepads()[0]);
      if (navigator.getGamepads) {
        node.interval = setInterval(function () {
          if (navigator.getGamepads && navigator.getGamepads()[controllerId]) {
            var msg = { topic: 'gamepad' };
            var payload = navigator.getGamepads()[controllerId];
            var axes = payload.axes,
                buttons = payload.buttons,
                connected = payload.connected,
                id = payload.id,
                index = payload.index,
                mapping = payload.mapping,
                timestamp = payload.timestamp;

            if (Array.isArray(axes) && node.roundAxes) {
              axes = axes.map(Math.round);
            }
            msg.payload = { axes: axes, buttons: buttons, connected: connected, id: id, index: index, mapping: mapping, timestamp: timestamp };
            msg.payload.buttons = buttons.map(function (button) {
              return { pressed: button.pressed, value: button.value };
            });
            if (!node.onlyButtonChanges || node.onlyButtonChanges && !_.isEqual(node.lastButtons, msg.payload.buttons)) {
              node.send(msg);
            }
            node.lastButtons = msg.payload.buttons;
          }
        }, refreshInterval);
      } else {
        node.error('navigator.getGamepads is not available in this browser');
      }

      node.on('close', function () {
        clearInterval(node.interval);
      });
      return _this;
    }

    return GamepadNode;
  }(PN.Node);

  PN.nodes.registerType("gamepad", GamepadNode);
};