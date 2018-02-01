"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

if (process.env.BROWSER) {
  process.hrtime = require('browser-process-hrtime');
}

//Simple node to introduce a pause into a flow
module.exports = function (PN) {

  var MILLIS_TO_NANOS = 1000000;
  var SECONDS_TO_NANOS = 1000000000;

  var DelayNode = function (_PN$Node) {
    _inherits(DelayNode, _PN$Node);

    function DelayNode(n) {
      _classCallCheck(this, DelayNode);

      var _this = _possibleConstructorReturn(this, (DelayNode.__proto__ || Object.getPrototypeOf(DelayNode)).call(this, n));

      _this.pauseType = n.pauseType;
      _this.timeoutUnits = n.timeoutUnits;
      _this.randomUnits = n.randomUnits;
      _this.rateUnits = n.rateUnits;

      if (n.timeoutUnits === "milliseconds") {
        _this.timeout = n.timeout;
      } else if (n.timeoutUnits === "minutes") {
        _this.timeout = n.timeout * (60 * 1000);
      } else if (n.timeoutUnits === "hours") {
        _this.timeout = n.timeout * (60 * 60 * 1000);
      } else if (n.timeoutUnits === "days") {
        _this.timeout = n.timeout * (24 * 60 * 60 * 1000);
      } else {
        // Default to seconds
        _this.timeout = n.timeout * 1000;
      }

      if (n.rateUnits === "minute") {
        _this.rate = 60 * 1000 / n.rate;
      } else if (n.rateUnits === "hour") {
        _this.rate = 60 * 60 * 1000 / n.rate;
      } else if (n.rateUnits === "day") {
        _this.rate = 24 * 60 * 60 * 1000 / n.rate;
      } else {
        // Default to seconds
        _this.rate = 1000 / n.rate;
      }

      if (n.randomUnits === "milliseconds") {
        _this.randomFirst = n.randomFirst * 1;
        _this.randomLast = n.randomLast * 1;
      } else if (n.randomUnits === "minutes") {
        _this.randomFirst = n.randomFirst * (60 * 1000);
        _this.randomLast = n.randomLast * (60 * 1000);
      } else if (n.randomUnits === "hours") {
        _this.randomFirst = n.randomFirst * (60 * 60 * 1000);
        _this.randomLast = n.randomLast * (60 * 60 * 1000);
      } else if (n.randomUnits === "days") {
        _this.randomFirst = n.randomFirst * (24 * 60 * 60 * 1000);
        _this.randomLast = n.randomLast * (24 * 60 * 60 * 1000);
      } else {
        // Default to seconds
        _this.randomFirst = n.randomFirst * 1000;
        _this.randomLast = n.randomLast * 1000;
      }

      _this.diff = _this.randomLast - _this.randomFirst;
      _this.name = n.name;
      _this.idList = [];
      _this.buffer = [];
      _this.intervalID = -1;
      _this.randomID = -1;
      _this.lastSent = null;
      _this.drop = n.drop;
      var node = _this;

      if (_this.pauseType === "delay") {
        _this.on("input", function (msg) {
          var id;
          id = setTimeout(function () {
            node.idList.splice(node.idList.indexOf(id), 1);
            if (node.idList.length === 0) {
              node.status({});
            }
            node.send(msg);
          }, node.timeout);
          this.idList.push(id);
          if (node.timeout > 1000 && node.idList.length !== 0) {
            node.status({ fill: "blue", shape: "dot", text: " " });
          }
        });

        _this.on("close", function () {
          for (var i = 0; i < this.idList.length; i++) {
            clearTimeout(this.idList[i]);
          }
          this.idList = [];
          this.status({});
        });
      } else if (_this.pauseType === "rate") {
        _this.on("input", function (msg) {
          if (!node.drop) {
            if (node.intervalID !== -1) {
              node.buffer.push(msg);
              if (node.buffer.length > 0) {
                node.status({ text: node.buffer.length });
              }
              if (node.buffer.length > 1000) {
                node.warn(this.name + " " + PN._("delay.error.buffer"));
              }
            } else {
              node.send(msg);
              node.intervalID = setInterval(function () {
                if (node.buffer.length === 0) {
                  clearInterval(node.intervalID);
                  node.intervalID = -1;
                  node.status({});
                }

                if (node.buffer.length > 0) {
                  node.send(node.buffer.shift());
                  node.status({ text: node.buffer.length });
                }
              }, node.rate);
            }
          } else {
            var timeSinceLast;
            if (node.lastSent) {
              timeSinceLast = process.hrtime(node.lastSent);
            }
            if (!node.lastSent) {
              // ensuring that we always send the first message
              node.lastSent = process.hrtime();
              node.send(msg);
            } else if (timeSinceLast[0] * SECONDS_TO_NANOS + timeSinceLast[1] > node.rate * MILLIS_TO_NANOS) {
              node.lastSent = process.hrtime();
              node.send(msg);
            }
          }
        });

        _this.on("close", function () {
          clearInterval(this.intervalID);
          this.buffer = [];
        });
      } else if (_this.pauseType === "queue") {
        _this.intervalID = setInterval(function () {
          if (node.buffer.length > 0) {
            node.send(node.buffer.shift()); // send the first on the queue
          }
          node.status({ text: node.buffer.length });
        }, node.rate);

        _this.on("input", function (msg) {
          if (!msg.hasOwnProperty("topic")) {
            msg.topic = "_none_";
          }
          var hit = false;
          for (var b in node.buffer) {
            // check if already in queue
            if (msg.topic === node.buffer[b].topic) {
              node.buffer[b] = msg; // if so - replace existing entry
              hit = true;
            }
          }
          if (!hit) {
            node.buffer.push(msg);
          } // if not add to end of queue
          node.status({ text: node.buffer.length });
        });

        _this.on("close", function () {
          clearInterval(this.intervalID);
          this.buffer = [];
          node.status({});
        });
      } else if (_this.pauseType === "random") {
        _this.on("input", function (msg) {
          var wait = node.randomFirst + node.diff * Math.random();
          var id = setTimeout(function () {
            node.idList.splice(node.idList.indexOf(id), 1);
            node.send(msg);
          }, wait);
          this.idList.push(id);
        });

        _this.on("close", function () {
          for (var i = 0; i < this.idList.length; i++) {
            clearTimeout(this.idList[i]);
          }
          this.idList = [];
        });
      }
      return _this;
    }

    return DelayNode;
  }(PN.Node);

  PN.nodes.registerType("delay", DelayNode);
};