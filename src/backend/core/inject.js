module.exports = function(PN) {
  "use strict";

  class InjectNode extends PN.Node {

    constructor(n) {
      super(n);
      this.topic = n.topic;
      this.payload = n.payload;
      this.payloadType = n.payloadType;
      this.repeat = n.repeat;
      this.crontab = n.crontab;
      this.once = n.once;
      var node = this;
      this.type = 'inject';
      this.interval_id = null;
      this.cronjob = null;
      this.allowDebugInput = n.allowDebugInput;

      if (this.repeat && !isNaN(this.repeat) && this.repeat > 0) {
        this.repeat = this.repeat * 1000;
        if (PN.settings.verbose) { this.log(PN._("inject.repeat",this)); }
        this.interval_id = setInterval( function() {
          node.emit("emitMsg",{});
        }, this.repeat );
      } else if (this.crontab) {
        if (PN.settings.verbose) { this.log(PN._("inject.crontab",this)); }
      }

      if (this.once) {
        setTimeout( function(){ node.emit("emitMsg",{}); }, 100);
      }

      this.on('emitMsg', () => {
        var msg = {topic:this.topic};
        if ( (!this.payloadType && !this.payload) || this.payloadType === "date") {
          msg.payload = Date.now();
        } else if (!this.payloadType) {
          msg.payload = this.payload;
        } else {
          msg.payload = PN.util.evaluateNodeProperty(this.payload,this.payloadType,this,msg);
        }
        this.send(msg);
        msg = null;
      });
    }

    close() {
      if (this.interval_id != null) {
        clearInterval(this.interval_id);
        if (PN.settings.verbose) { this.log(PN._("inject.stopped")); }
      } else if (this.cronjob != null) {
        this.cronjob.stop();
        if (PN.settings.verbose) { this.log(PN._("inject.stopped")); }
        delete this.cronjob;
      }
    }
  }

  PN.nodes.registerType("inject",InjectNode);

  PN.events.on("rpc_inject", function(data) {
    var node = PN.nodes.getNode(data.params[0]);
    if (node != null) {
      if(data.params[1]){
        node.send({
          topic: node.topic,
          payload: data.params[1]
        });
      }else{
        node.emit('emitMsg');
      }
      data.reply('ok');
    } else {
      data.reply('not ok');
    }
  });

  PN.events.on("rpc_inject_text", function(data) {
    PN.nodes.eachNode(function(n){
      // console.log('each node', n);
      if(n.type === 'inject' && n.allowDebugInput){
        n.send({
          topic: n.topic,
          payload: data.params[0]
        });
      }
    });
    data.reply('ok');
  });
}
