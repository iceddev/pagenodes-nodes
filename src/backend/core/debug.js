
module.exports = function(PN) {
  "use strict";
  var util = require("util");
  var events = require("events");
  var debuglength = PN.settings.debugMaxLength||1000;
  var useColors = false;

  class DebugNode extends PN.Node {
    constructor(n) {
      super(n);
      this.complete = (n.complete||"payload").toString();

      if (this.complete === "false") {
        this.complete = "payload";
      }

      this.console = n.console;
      this.active = (n.active === null || typeof n.active === "undefined") || n.active;
      var node = this;

      this.on("input",function(msg) {
        var file = null;
        if(msg.fileInfo && msg.fileInfo.name && msg.fileInfo.size && msg.fileInfo.data){
          file = {fileInfo: msg.fileInfo};
        }
        if (this.complete === "true") {
          // debug complete msg object
          if (this.console === "true") {
            node.log("\n"+util.inspect(msg, {colors:useColors, depth:10}));
          }
          if (this.active) {
            sendDebug({id:this.id,name:this.name,topic:msg.topic,msg:msg,_path:msg._path, image: msg.image, file: file});
          }

        } else {
          // debug user defined msg property
          var property = "payload";
          var output = msg[property];
          if (this.complete !== "false" && typeof this.complete !== "undefined") {
            property = this.complete;
            var propertyParts = property.split(".");
            try {
              output = propertyParts.reduce(function (obj, i) {
                return obj[i];
              }, msg);
            } catch (err) {
              output = undefined;
            }
          }
          if (this.console === "true") {
            if (typeof output === "string") {
              node.log((output.indexOf("\n") !== -1 ? "\n" : "") + output);
            } else if (typeof output === "object") {
              node.log("\n"+util.inspect(output, {colors:useColors, depth:10}));
            } else {
              node.log(util.inspect(output, {colors:useColors}));
            }
          }
          if (this.active) {
            sendDebug({id:this.id,name:this.name,topic:msg.topic,property:property,msg:output,_path:msg._path, image: msg.image, file: file});
          }
        }
      });
    }

  }

  PN.nodes.registerType("debug",DebugNode);

  function sendDebug(msg) {
    if (msg.msg instanceof Error) {
      msg.format = "error";
      msg.msg = msg.msg.toString();
    } else if (msg.msg instanceof Buffer) {
      msg.format = "buffer ["+msg.msg.length+"]";
      msg.msg = msg.msg.toString('hex');
    } else if (msg.msg && typeof msg.msg === 'object') {
      var seen = [];
      if(msg.msg && msg.msg.constructor){
        msg.format = msg.msg.constructor.name || "Object";
      }
      else{
        msg.format = "Object";
      }

      var isArray = util.isArray(msg.msg);
      if (isArray) {
        msg.format = "array ["+msg.msg.length+"]";
      }
      if (isArray || (msg.format === "Object")) {
        msg.msg = JSON.stringify(msg.msg, function(key, value) {
          if (typeof value === 'object' && value !== null) {
            if (seen.indexOf(value) !== -1) { return "[circular]"; }
            seen.push(value);
          }
          return value;
        }," ");
      } else {
        try { msg.msg = msg.msg.toString(); }
        catch(e) { msg.msg = "[Type not printable]"; }
      }
      seen = null;
    } else if (typeof msg.msg === "boolean") {
      msg.format = "boolean";
      msg.msg = msg.msg.toString();
    } else if (typeof msg.msg === "number") {
      msg.format = "number";
      msg.msg = msg.msg.toString();
    } else if (msg.msg === 0) {
      msg.format = "number";
      msg.msg = "0";
    } else if (msg.msg === null || typeof msg.msg === "undefined") {
      msg.format = (msg.msg === null)?"null":"undefined";
      msg.msg = "(undefined)";
    } else {
      msg.format = "string ["+msg.msg.length+"]";
      msg.msg = msg.msg;
    }

    if (msg.msg.length > debuglength) {
      msg.msg = msg.msg.substr(0,debuglength) +" ....";
    }

    PN.comms.publish("debug",msg);
  }

  DebugNode.logHandler = new events.EventEmitter();
  DebugNode.logHandler.on("log",function(msg) {
    if (msg.level === PN.log.WARN || msg.level === PN.log.ERROR) {
      sendDebug(msg);
    }
  });
  PN.log.addHandler(DebugNode.logHandler);

  PN.events.on("rpc_debug", function(data) {
    var node = PN.nodes.getNode(data.params[0]);
    var state = data.params[1];
    if (node !== null && typeof node !== "undefined" ) {
      if (state === "enable") {
        node.active = true;
        data.reply(200);
      } else if (state === "disable") {
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
