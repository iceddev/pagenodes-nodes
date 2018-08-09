"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var util = require("util");
var events = require("events");

var _require = require('lodash'),
    get = _require.get;

module.exports = function (PN) {

  var debuglength = PN.settings.debugMaxLength || 1000;
  var useColors = false;

  var DebugNode = function (_PN$Node) {
    _inherits(DebugNode, _PN$Node);

    function DebugNode(n) {
      _classCallCheck(this, DebugNode);

      var _this = _possibleConstructorReturn(this, (DebugNode.__proto__ || Object.getPrototypeOf(DebugNode)).call(this, n));

      _this.complete = (n.complete || "payload").toString();

      if (_this.complete === "false") {
        _this.complete = "payload";
      }

      _this.console = n.console;
      _this.active = n.active === null || typeof n.active === "undefined" || n.active;
      var node = _this;

      _this.on("input", function (msg) {
        var file = null;
        if (msg.fileInfo && msg.fileInfo.name && msg.fileInfo.size && msg.fileInfo.data) {
          file = { fileInfo: msg.fileInfo };
        }
        if (this.complete === "true") {
          // debug complete msg object
          if (this.console === "true") {
            node.log("\n" + util.inspect(msg, { colors: useColors, depth: 10 }));
          }
          if (this.active) {
            sendDebug({ id: this.id, name: this.name, topic: msg.topic, msg: msg, _path: msg._path, image: msg.image, file: file });
          }
        } else {
          // debug user defined msg property
          var property = "payload";
          var output = msg[property];
          if (this.complete !== "false" && typeof this.complete !== "undefined") {
            output = get(msg, this.complete);
          }
          if (this.console === "true") {
            if (typeof output === "string") {
              node.log((output.indexOf("\n") !== -1 ? "\n" : "") + output);
            } else if ((typeof output === "undefined" ? "undefined" : _typeof(output)) === "object") {
              node.log("\n" + util.inspect(output, { colors: useColors, depth: 10 }));
            } else {
              node.log(util.inspect(output, { colors: useColors }));
            }
          }
          if (this.active) {
            sendDebug({ id: this.id, name: this.name, topic: msg.topic, property: property, msg: output, _path: msg._path, image: msg.image, file: file });
          }
        }
      });
      return _this;
    }

    return DebugNode;
  }(PN.Node);

  PN.nodes.registerType("debug", DebugNode);

  function sendDebug(msg) {
    if (msg.msg instanceof Error) {
      msg.format = "error";
      msg.msg = msg.msg.toString();
    } else if (msg.msg instanceof Buffer) {
      msg.format = "buffer [" + msg.msg.length + "]";
      msg.msg = msg.msg.toString('hex');
    } else if (msg.msg && _typeof(msg.msg) === 'object') {
      var seen = [];
      if (msg.msg && msg.msg.constructor) {
        msg.format = msg.msg.constructor.name || "Object";
      } else {
        msg.format = "Object";
      }

      var isArray = util.isArray(msg.msg);
      if (isArray) {
        msg.format = "array [" + msg.msg.length + "]";
      }
      if (isArray || msg.format === "Object") {
        msg.msg = JSON.stringify(msg.msg, function (key, value) {
          if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object' && value !== null) {
            if (seen.indexOf(value) !== -1) {
              return "[circular]";
            }
            seen.push(value);
          }
          return value;
        }, " ");
      } else {
        try {
          msg.msg = msg.msg.toString();
        } catch (e) {
          msg.msg = "[Type not printable]";
        }
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
      msg.format = msg.msg === null ? "null" : "undefined";
      msg.msg = "(undefined)";
    } else {
      msg.format = "string [" + msg.msg.length + "]";
      msg.msg = msg.msg;
    }

    if (msg.msg.length > debuglength) {
      msg.msg = msg.msg.substr(0, debuglength) + " ....";
    }

    PN.comms.publish("debug", msg);
  }

  DebugNode.logHandler = new events.EventEmitter();
  DebugNode.logHandler.on("log", function (msg) {
    if (msg.level === PN.log.WARN || msg.level === PN.log.ERROR) {
      sendDebug(msg);
    }
  });
  PN.log.addHandler(DebugNode.logHandler);

  PN.events.on("rpc_debug", function (data) {
    var node = PN.nodes.getNode(data.params[0]);
    var state = data.params[1];
    if (node !== null && typeof node !== "undefined") {
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