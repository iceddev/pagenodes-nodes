'use strict';

module.exports = function(PN) {

  class EspeakNode extends PN.Node {
    constructor(n) {
      super(n);
      this.variant = n.variant;

      this.console = n.console;
      this.active = (n.active === null || typeof n.active === 'undefined') || n.active;
      var node = this;

      this.on('input',function(msg) {

        if (this.active) {
          sendEspeak({id:this.id, name:this.name, topic:msg.topic, msg:msg, variant: msg.variant || node.variant});
        }

      });
    }
  }

  PN.nodes.registerType('espeak', EspeakNode);

  function sendEspeak(msg) {
    PN.comms.publish('espeak', msg);
  }

  PN.events.on('rpc_espeak', function(data) {
    var node = PN.nodes.getNode(data.params[0]);
    var state = data.params[1];
    if (node !== null && typeof node !== 'undefined' ) {
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
