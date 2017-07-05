'use strict';

module.exports = function (PN) {
  function GamepadNode(config) {
    PN.nodes.createNode(this, config);
    var node = this;
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
  }
  PN.nodes.registerType("gamepad", GamepadNode);
};