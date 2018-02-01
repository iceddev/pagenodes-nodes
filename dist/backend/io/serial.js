"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

global.Buffer = Buffer;

function init(PN) {
  var SerialInNode = function (_PN$Node) {
    _inherits(SerialInNode, _PN$Node);

    function SerialInNode(n) {
      _classCallCheck(this, SerialInNode);

      var _this = _possibleConstructorReturn(this, (SerialInNode.__proto__ || Object.getPrototypeOf(SerialInNode)).call(this, n));

      var node = _this;
      node.connection = n.connection;
      node.connectionConfig = PN.nodes.getNode(node.connection);

      if (node.connectionConfig) {
        node.status({ fill: "yellow", shape: "dot", text: "connecting..." });

        node.connectionConfig.on('connReady', function (conn) {
          node.status({ fill: "green", shape: "dot", text: "connected" });
        });

        node.connectionConfig.on('data', function (data) {
          node.send({
            topic: 'serial',
            payload: data
          });
        });

        node.connectionConfig.on('connError', function (err) {
          node.status({ fill: "red", shape: "dot", text: "error" });
        });
      }

      return _this;
    }

    return SerialInNode;
  }(PN.Node);

  SerialInNode.groupName = 'serial';
  PN.nodes.registerType("serial in", SerialInNode);

  var SerialOutNode = function (_PN$Node2) {
    _inherits(SerialOutNode, _PN$Node2);

    function SerialOutNode(n) {
      _classCallCheck(this, SerialOutNode);

      var _this2 = _possibleConstructorReturn(this, (SerialOutNode.__proto__ || Object.getPrototypeOf(SerialOutNode)).call(this, n));

      var node = _this2;
      node.connection = n.connection;
      node.connectionConfig = PN.nodes.getNode(node.connection);

      if (node.connectionConfig) {

        node.status({ fill: "yellow", shape: "dot", text: "connecting..." });

        node.connectionConfig.on('connReady', function (conn) {
          node.status({ fill: "green", shape: "dot", text: "connected" });
        });

        node.on('input', function (msg) {
          if (node.connectionConfig.sp) {
            if (!Buffer.isBuffer(msg.payload)) {
              msg.payload = new Buffer(msg.payload);
            }
            node.connectionConfig.sp.write(msg.payload, function (err, ok) {
              if (err) {
                node.error(err);
              }
            });
          }
        });

        node.connectionConfig.on('connError', function (err) {
          node.status({ fill: "red", shape: "dot", text: "error" });
        });
      } else {
        node.error("missing connection configuration");
      }
      return _this2;
    }

    return SerialOutNode;
  }(PN.Node);

  SerialOutNode.groupName = 'serial';
  PN.nodes.registerType("serial out", SerialOutNode);
}

module.exports = init;