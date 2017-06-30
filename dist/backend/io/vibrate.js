'use strict';

module.exports = function (PN) {
  var util = require('util');
  var events = require('events');
  var debuglength = PN.settings.debugMaxLength || 1000;
  var useColors = false;

  function VibrateNode(n) {
    PN.nodes.createNode(this, n);
    this.name = n.name;
    this.duration = parseInt(n.duration, 10);

    this.console = n.console;
    this.active = n.active === null || typeof n.active === 'undefined' || n.active;
    var node = this;

    this.on('input', function (msg) {
      if (this.active) {
        if (navigator.vibrate) {
          navigator.vibrate(parseInt(msg.duration, 10) || node.duration || 200);
        }
      }
    });
  }

  PN.nodes.registerType('vibrate', VibrateNode);

  PN.events.on('rpc_vibrate', function (data) {
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