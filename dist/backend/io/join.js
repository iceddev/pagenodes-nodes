"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var JoinNode = function (_PN$Node) {
    _inherits(JoinNode, _PN$Node);

    function JoinNode(n) {
      _classCallCheck(this, JoinNode);

      var _this = _possibleConstructorReturn(this, (JoinNode.__proto__ || Object.getPrototypeOf(JoinNode)).call(this, n));

      _this.mode = n.mode || "auto";
      _this.property = n.property || "payload";
      _this.propertyType = n.propertyType || "msg";
      if (_this.propertyType === 'full') {
        _this.property = "payload";
      }
      _this.key = n.key || "topic";
      _this.timer = _this.mode === "auto" ? 0 : Number(n.timeout || 0) * 1000;
      _this.timerr = n.timerr || "send";
      _this.count = Number(n.count || 0);
      _this.joiner = (n.joiner || "").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t").replace(/\\e/g, "\e").replace(/\\f/g, "\f").replace(/\\0/g, "\0");
      _this.build = n.build || "array";
      var node = _this;
      var inflight = {};

      var completeSend = function completeSend(partId) {
        var group = inflight[partId];
        clearTimeout(group.timeout);
        delete inflight[partId];

        if (group.type === 'string') {
          PN.util.setMessageProperty(group.msg, node.property, group.payload.join(group.joinChar));
        } else {
          PN.util.setMessageProperty(group.msg, node.property, group.payload);
        }
        if (group.msg.hasOwnProperty('parts') && group.msg.parts.hasOwnProperty('parts')) {
          group.msg.parts = group.msg.parts.parts;
        } else {
          delete group.msg.parts;
        }
        node.send(group.msg);
      };

      _this.on("input", function (msg) {
        try {
          var property;
          if (node.mode === 'auto' && (!msg.hasOwnProperty("parts") || !msg.parts.hasOwnProperty("id"))) {
            node.warn("Message missing msg.parts property - cannot join in 'auto' mode");
            return;
          }
          if (node.propertyType == "full") {
            property = msg;
          } else {
            try {
              property = PN.util.getMessageProperty(msg, node.property);
            } catch (err) {
              node.warn("Message property " + node.property + " not found");
              return;
            }
          }

          var partId;
          var payloadType;
          var propertyKey;
          var targetCount;
          var joinChar;
          var propertyIndex;
          if (node.mode === "auto") {
            // Use msg.parts to identify all of the group information
            partId = msg.parts.id;
            payloadType = msg.parts.type;
            targetCount = msg.parts.count;
            joinChar = msg.parts.ch;
            propertyKey = msg.parts.key;
            propertyIndex = msg.parts.index;
          } else {
            // Use the node configuration to identify all of the group information
            partId = "_";
            payloadType = node.build;
            targetCount = node.count;
            joinChar = node.joiner;
            if (targetCount === 0 && msg.hasOwnProperty('parts')) {
              targetCount = msg.parts.count || 0;
            }
            if (node.build === 'object') {
              propertyKey = PN.util.getMessageProperty(msg, node.key);
            }
          }
          if (payloadType === 'object' && (propertyKey === null || propertyKey === undefined || propertyKey === "")) {
            if (node.mode === "auto") {
              node.warn("Message missing 'msg.parts.key' property - cannot add to object");
            } else {
              node.warn("Message missing key property 'msg." + node.key + "' '- cannot add to object");
            }
            return;
          }
          if (!inflight.hasOwnProperty(partId)) {
            if (payloadType === 'object' || payloadType === 'merged') {
              inflight[partId] = {
                currentCount: 0,
                payload: {},
                targetCount: targetCount,
                type: "object",
                msg: msg
              };
            } else {
              inflight[partId] = {
                currentCount: 0,
                payload: [],
                targetCount: targetCount,
                type: payloadType,
                joinChar: joinChar,
                msg: msg
              };
              if (payloadType === 'string') {
                inflight[partId].joinChar = joinChar;
              }
            }
            if (node.timer > 0) {
              inflight[partId].timeout = setTimeout(function () {
                completeSend(partId);
              }, node.timer);
            }
          }

          var group = inflight[partId];
          if (payloadType === 'object') {
            group.payload[propertyKey] = property;
            group.currentCount = Object.keys(group.payload).length;
          } else if (payloadType === 'merged') {
            if (Array.isArray(property) || (typeof property === "undefined" ? "undefined" : _typeof(property)) !== 'object') {
              node.warn("Cannot merge non-object types");
            } else {
              for (propertyKey in property) {
                if (property.hasOwnProperty(propertyKey)) {
                  group.payload[propertyKey] = property[propertyKey];
                }
              }
              group.currentCount++;
            }
          } else {
            if (!isNaN(propertyIndex)) {
              group.payload[propertyIndex] = property;
            } else {
              group.payload.push(property);
            }
            group.currentCount++;
          }
          // TODO: currently reuse the last received - add option to pick first received
          group.msg = msg;
          if (group.currentCount === group.targetCount || msg.hasOwnProperty('complete')) {
            delete msg.complete;
            completeSend(partId);
          }
        } catch (err) {
          console.log(err.stack);
        }
      });

      _this.on("close", function () {
        for (var i in inflight) {
          if (inflight.hasOwnProperty(i)) {
            clearTimeout(inflight[i].timeout);
          }
        }
      });
      return _this;
    }

    return JoinNode;
  }(PN.Node);

  PN.nodes.registerType("join", JoinNode);
};