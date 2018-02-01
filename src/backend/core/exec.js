module.exports = function(PN) {
  const spawn = require('child_process').spawn;
  const exec = require('child_process').exec;
  const isUtf8 = require('is-utf8');

  class ExecNode extends PN.Node {
    constructor(n) {
      super(n);
      this.cmd = (n.command || "").trim();
      if (n.addpay === undefined) { n.addpay = true; }
      this.addpay = n.addpay;
      this.append = (n.append || "").trim();
      this.useSpawn = n.useSpawn;

      var node = this;
      this.on("input", function(msg) {
        node.status({fill:"blue",shape:"dot",text:" "});
        if (this.useSpawn === true) {
          // make the extra args into an array
          // then prepend with the msg.payload

          var arg = node.cmd+" "+msg.payload+" "+node.append;
          // slice whole line by spaces (trying to honour quotes);
          arg = arg.match(/(?:[^\s"]+|"[^"]*")+/g);
          var cmd = arg.shift();
          if (PN.settings.verbose) { node.log(cmd+" ["+arg+"]"); }
          if (cmd.indexOf(" ") == -1) {
            var ex = spawn(cmd,arg);
            ex.stdout.on('data', function (data) {
              if (isUtf8(data)) { msg.payload = data.toString(); }
              else { msg.payload = data; }
              node.send([msg,null,null]);
            });
            ex.stderr.on('data', function (data) {
              if (isUtf8(data)) { msg.payload = data.toString(); }
              else { msg.payload = new Buffer(data); }
              node.send([null,msg,null]);
            });
            ex.on('close', function (code) {
              msg.payload = code;
              node.status({});
              node.send([null,null,msg]);
            });
            ex.on('error', function (code) {
              node.error(code,msg);
            });
          }
          else { node.error(PN._("exec.spawnerr")); }
        }
        else {
          var cl = node.cmd;
          if ((node.addpay === true) && ((msg.payload.toString() || "").trim() !== "")) { cl += " "+msg.payload; }
          if (node.append.trim() !== "") { cl += " "+node.append; }
          if (PN.settings.verbose) { node.log(cl); }
          var child = exec(cl, {encoding: 'binary', maxBuffer:10000000}, function (error, stdout, stderr) {
            msg.payload = new Buffer(stdout,"binary");
            try {
              if (isUtf8(msg.payload)) { msg.payload = msg.payload.toString(); }
            } catch(e) {
              node.log(PN._("exec.badstdout"));
            }
            var msg2 = {payload:stderr};
            var msg3 = null;
            if (error !== null) {
              msg3 = {payload:error};
            }
            node.status({});
            node.send([msg,msg2,msg3]);
          });
        }
      });
    }
  }

  PN.nodes.registerType("exec",ExecNode);
}
