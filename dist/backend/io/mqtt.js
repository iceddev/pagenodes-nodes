'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mqtt = require('mqtt');
var isUtf8 = require('is-utf8');
var _ = require('lodash');

function init(PN) {
  var MQTTBrokerNode = function (_PN$Node) {
    _inherits(MQTTBrokerNode, _PN$Node);

    function MQTTBrokerNode(n) {
      _classCallCheck(this, MQTTBrokerNode);

      var _this = _possibleConstructorReturn(this, (MQTTBrokerNode.__proto__ || Object.getPrototypeOf(MQTTBrokerNode)).call(this, n));

      var self = _this;
      self.server = n.server;

      self.username = n.username;
      self.password = n.password;
      self.clientId = n.clientId;

      var options = {
        username: self.username,
        password: self.password,
        clientId: self.clientId
      };

      try {
        self.conn = mqtt.connect(self.server, options);

        self.conn.on('connect', function () {
          process.nextTick(function () {
            self.emit('connReady', self.conn);
          });
        });

        self.conn.on('message', function (topic, payload) {
          // console.log('mqtt message received', topic, payload);
          if (isUtf8(payload)) {
            payload = payload.toString();
          }
          self.emit('message_' + topic, payload);
        });

        self.conn.on('error', function (err) {
          console.log('error in mqtt connection', err);
          self.emit('connError', err);
          self.error(err);
        });
      } catch (exp) {
        console.log('error creating mqtt connection', exp);
        setTimeout(function () {
          self.emit('connError', {});
        }, 100);
        self.error(exp);
      }

      self.on('close', function () {
        self.conn.end();
      });

      return _this;
    }

    return MQTTBrokerNode;
  }(PN.Node);

  MQTTBrokerNode.groupName = 'mqtt';
  PN.nodes.registerType("mqtt-broker", MQTTBrokerNode);

  var MQTTInNode = function (_PN$Node2) {
    _inherits(MQTTInNode, _PN$Node2);

    function MQTTInNode(n) {
      _classCallCheck(this, MQTTInNode);

      var _this2 = _possibleConstructorReturn(this, (MQTTInNode.__proto__ || Object.getPrototypeOf(MQTTInNode)).call(this, n));

      var self = _this2;
      self.topic = n.topic;
      self.broker = n.broker;
      self.brokerConfig = PN.nodes.getNode(self.broker);

      if (self.brokerConfig) {
        self.status({ fill: "yellow", shape: "dot", text: "connecting..." });

        self.brokerConfig.on('connReady', function (conn) {
          self.status({ fill: "green", shape: "dot", text: "connected" });
          self.brokerConfig.conn.subscribe(self.topic);
        });

        self.brokerConfig.on('message_' + self.topic, function (payload) {
          self.send({
            topic: self.topic,
            payload: payload
          });
        });

        self.brokerConfig.on('connError', function (err) {
          self.status({ fill: "red", shape: "dot", text: "error" });
        });
      }

      return _this2;
    }

    return MQTTInNode;
  }(PN.Node);

  MQTTInNode.groupName = 'mqtt';
  PN.nodes.registerType("mqtt in", MQTTInNode);

  var MQTTOutNode = function (_PN$Node3) {
    _inherits(MQTTOutNode, _PN$Node3);

    function MQTTOutNode(n) {
      _classCallCheck(this, MQTTOutNode);

      var _this3 = _possibleConstructorReturn(this, (MQTTOutNode.__proto__ || Object.getPrototypeOf(MQTTOutNode)).call(this, n));

      var self = _this3;
      self.broker = n.broker;
      self.brokerConfig = PN.nodes.getNode(self.broker);
      self.topic = n.topic;

      if (self.brokerConfig) {

        self.status({ fill: "yellow", shape: "dot", text: "connecting..." });

        self.brokerConfig.on('connReady', function (conn) {
          self.status({ fill: "green", shape: "dot", text: "connected" });
        });

        self.on('input', function (msg) {
          if (self.brokerConfig.conn) {
            var topic = msg.topic || self.topic;
            if (topic) {
              if (!Buffer.isBuffer(msg.payload)) {
                if (_typeof(msg.payload) === 'object') {
                  msg.payload = JSON.stringify(msg.payload);
                } else if (typeof msg.payload !== 'string') {
                  msg.payload = '' + msg.payload;
                }
              }

              var options = {
                qos: msg.qos || 0,
                retain: msg.retain || false
              };

              self.brokerConfig.conn.publish(topic, msg.payload, options);
            } else {
              self.error("must publish on a topic");
            }
          }
        });

        self.brokerConfig.on('connError', function (err) {
          self.status({ fill: "red", shape: "dot", text: "error" });
        });
      } else {
        self.error("missing broker configuration");
      }
      return _this3;
    }

    return MQTTOutNode;
  }(PN.Node);

  MQTTOutNode.groupName = 'mqtt';
  PN.nodes.registerType("mqtt out", MQTTOutNode);
}

module.exports = init;