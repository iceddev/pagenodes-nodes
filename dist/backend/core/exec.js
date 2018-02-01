'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var spawn = require('child_process').spawn;
  var exec = require('child_process').exec;
  var isUtf8 = require('is-utf8');

  var ExecNode = function (_PN$Node) {
    _inherits(ExecNode, _PN$Node);

    function ExecNode(n) {
      _classCallCheck(this, ExecNode);

      var _this = _possibleConstructorReturn(this, (ExecNode.__proto__ || Object.getPrototypeOf(ExecNode)).call(this, n));

      _this.cmd = (n.command || "").trim();
      if (n.addpay === undefined) {
        n.addpay = true;
      }
      _this.addpay = n.addpay;
      _this.append = (n.append || "").trim();
      _this.useSpawn = n.useSpawn;

      var node = _this;
      _this.on("input", function (msg) {
        node.status({ fill: "blue", shape: "dot", text: " " });
        if (this.useSpawn === true) {
          // make the extra args into an array
          // then prepend with the msg.payload

          var arg = node.cmd + " " + msg.payload + " " + node.append;
          // slice whole line by spaces (trying to honour quotes);
          arg = arg.match(/(?:[^\s"]+|"[^"]*")+/g);
          var cmd = arg.shift();
          if (PN.settings.verbose) {
            node.log(cmd + " [" + arg + "]");
          }
          if (cmd.indexOf(" ") == -1) {
            var ex = spawn(cmd, arg);
            ex.stdout.on('data', function (data) {
              if (isUtf8(data)) {
                msg.payload = data.toString();
              } else {
                msg.payload = data;
              }
              node.send([msg, null, null]);
            });
            ex.stderr.on('data', function (data) {
              if (isUtf8(data)) {
                msg.payload = data.toString();
              } else {
                msg.payload = new Buffer(data);
              }
              node.send([null, msg, null]);
            });
            ex.on('close', function (code) {
              msg.payload = code;
              node.status({});
              node.send([null, null, msg]);
            });
            ex.on('error', function (code) {
              node.error(code, msg);
            });
          } else {
            node.error(PN._("exec.spawnerr"));
          }
        } else {
          var cl = node.cmd;
          if (node.addpay === true && (msg.payload.toString() || "").trim() !== "") {
            cl += " " + msg.payload;
          }
          if (node.append.trim() !== "") {
            cl += " " + node.append;
          }
          if (PN.settings.verbose) {
            node.log(cl);
          }
          var child = exec(cl, { encoding: 'binary', maxBuffer: 10000000 }, function (error, stdout, stderr) {
            msg.payload = new Buffer(stdout, "binary");
            try {
              if (isUtf8(msg.payload)) {
                msg.payload = msg.payload.toString();
              }
            } catch (e) {
              node.log(PN._("exec.badstdout"));
            }
            var msg2 = { payload: stderr };
            var msg3 = null;
            if (error !== null) {
              msg3 = { payload: error };
            }
            node.status({});
            node.send([msg, msg2, msg3]);
          });
        }
      });
      return _this;
    }

    return ExecNode;
  }(PN.Node);

  PN.nodes.registerType("exec", ExecNode);
};