'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var rest = require('rest');
var mimeInterceptor = require('rest/interceptor/mime');
var errorCodeInterceptor = require('rest/interceptor/errorCode');
var restCall = rest.wrap(mimeInterceptor).wrap(errorCodeInterceptor);

function connectingStatus(n) {
  n.status({ fill: "yellow", shape: "ring", text: "initializing..." });
}

function j5WorkerStatus(n) {
  n.status({ fill: "yellow", shape: "dot", text: "j5 worker init..." });
}

function networkReadyStatus(n) {
  n.status({ fill: "yellow", shape: "ring", text: "connecting..." });
}

function networkErrorStatus(n) {
  n.status({ fill: "red", shape: "dot", text: "disconnected" });
}

function ioErrorStatus(n, err) {
  var errText = err.message || "error";
  n.status({ fill: "red", shape: "dot", text: errText });
}

function connectedStatus(n, text) {
  n.status({ fill: "green", shape: "dot", text: text || "connected" });
}

function setupStatus(node) {
  // console.log('setupStatus', node);
  process.nextTick(function () {
    connectingStatus(node);
  });
  node.nodebot.on('networkReady', function () {
    networkReadyStatus(node);
  });
  node.nodebot.on('workerReady', function () {
    networkReadyStatus(node);
  });
  node.nodebot.on('networkError', function () {
    networkErrorStatus(node);
  });
  node.nodebot.on('ioError', function (err) {
    ioErrorStatus(node, err);
  });
}

function init(PN) {
  var GpioInNode = function (_PN$Node) {
    _inherits(GpioInNode, _PN$Node);

    function GpioInNode(n) {
      _classCallCheck(this, GpioInNode);

      var _this = _possibleConstructorReturn(this, (GpioInNode.__proto__ || Object.getPrototypeOf(GpioInNode)).call(this, n));

      _this.buttonState = -1;
      _this.pin = n.pin;
      _this.state = n.state;
      _this.nodebot = PN.nodes.getNode(n.board);
      if (_typeof(_this.nodebot) === "object") {

        var node = _this;
        setupStatus(node);

        node.nodebot.on('boardReady', function () {
          var io = node.nodebot.io;
          connectedStatus(node);
          var samplingInterval = parseInt(samplingInterval, 10) || 300;
          node.nodebot.worker.postMessage({ type: 'inputSubscribe', state: node.state, pin: node.pin, nodeId: node.id, samplingInterval: samplingInterval });
          node.nodebot.on('inputSubscription_' + node.id, function (value) {
            var msg = { payload: value, topic: node.pin };
            node.send(msg);
          });
        });
      } else {
        _this.warn("nodebot not configured");
      }
      return _this;
    }

    return GpioInNode;
  }(PN.Node);

  GpioInNode.groupName = 'gpio';
  PN.nodes.registerType("gpio in", GpioInNode);

  var GpioOutNode = function (_PN$Node2) {
    _inherits(GpioOutNode, _PN$Node2);

    function GpioOutNode(n) {
      _classCallCheck(this, GpioOutNode);

      var _this2 = _possibleConstructorReturn(this, (GpioOutNode.__proto__ || Object.getPrototypeOf(GpioOutNode)).call(this, n));

      _this2.buttonState = -1;
      _this2.pin = n.pin;
      _this2.state = n.state;
      _this2.arduino = n.arduino;
      _this2.nodebot = PN.nodes.getNode(n.board);
      if (_typeof(_this2.nodebot) === "object") {
        var node = _this2;
        setupStatus(node);

        // console.log('launching gpio out', n);
        node.nodebot.on('boardReady', function () {
          connectedStatus(node);
          node.on('input', function (msg) {
            var state = msg.state || node.state;
            var pin = msg.pin || node.pin;
            node.nodebot.worker.postMessage({ type: 'output', state: state, pin: pin, nodeId: node.id, msg: msg });
          });
        });
      } else {
        _this2.warn("nodebot not configured");
      }

      return _this2;
    }

    return GpioOutNode;
  }(PN.Node);

  GpioOutNode.groupName = 'gpio';
  PN.nodes.registerType("gpio out", GpioOutNode);

  var NodePixelNode = function (_PN$Node3) {
    _inherits(NodePixelNode, _PN$Node3);

    function NodePixelNode(n) {
      _classCallCheck(this, NodePixelNode);

      var _this3 = _possibleConstructorReturn(this, (NodePixelNode.__proto__ || Object.getPrototypeOf(NodePixelNode)).call(this, n));

      _this3.buttonState = -1;
      _this3.pin = parseInt(n.pin, 10);
      _this3.length = parseInt(n.length, 10);
      _this3.controller = n.controller;

      _this3.nodebot = PN.nodes.getNode(n.board);
      if (_typeof(_this3.nodebot) === "object") {
        var node = _this3;
        setupStatus(node);

        // console.log('launching nodepixel', n);
        node.nodebot.on('boardReady', function () {

          connectedStatus(node);
          var pixelConfig = {
            pin: node.pin,
            length: node.length,
            controller: node.controller
          };

          node.nodebot.worker.postMessage({ type: 'setupPixel', config: pixelConfig, nodeId: node.id });

          node.on('input', function (msg) {
            node.nodebot.worker.postMessage({ type: 'pixelMsg', nodeId: node.id, msg: msg });
          });
        });
      } else {
        _this3.warn("nodebot not configured");
      }

      return _this3;
    }

    return NodePixelNode;
  }(PN.Node);

  NodePixelNode.groupName = 'gpio';
  PN.nodes.registerType("pixel", NodePixelNode);

  var ServoNode = function (_PN$Node4) {
    _inherits(ServoNode, _PN$Node4);

    function ServoNode(n) {
      _classCallCheck(this, ServoNode);

      var _this4 = _possibleConstructorReturn(this, (ServoNode.__proto__ || Object.getPrototypeOf(ServoNode)).call(this, n));

      _this4.buttonState = -1;
      _this4.pin = parseInt(n.pin, 10);
      _this4.controller = n.controller;
      _this4.mode = n.mode;
      _this4.upperRange = n.upperRange;
      _this4.lowerRange = n.lowerRange;

      _this4.nodebot = PN.nodes.getNode(n.board);
      if (_typeof(_this4.nodebot) === "object") {
        var node = _this4;
        setupStatus(node);

        node.nodebot.on('boardReady', function () {

          connectedStatus(node);
          var servoConfig = {
            pin: node.pin,
            mode: node.mode,
            controller: node.controller,
            lowerRange: node.lowerRange,
            upperRange: node.upperRange
          };

          node.nodebot.worker.postMessage({ type: 'setupServo', config: servoConfig, nodeId: node.id });

          node.on('input', function (msg) {
            node.nodebot.worker.postMessage({ type: 'servoMsg', nodeId: node.id, msg: msg });
          });
        });
      } else {
        _this4.warn("nodebot not configured");
      }

      return _this4;
    }

    return ServoNode;
  }(PN.Node);

  ServoNode.groupName = 'gpio';
  PN.nodes.registerType("servo", ServoNode);

  var NodeLedNode = function (_PN$Node5) {
    _inherits(NodeLedNode, _PN$Node5);

    function NodeLedNode(n) {
      _classCallCheck(this, NodeLedNode);

      var _this5 = _possibleConstructorReturn(this, (NodeLedNode.__proto__ || Object.getPrototypeOf(NodeLedNode)).call(this, n));

      _this5.address = parseInt(n.address, 10);
      _this5.mode = n.mode;

      _this5.nodebot = PN.nodes.getNode(n.board);
      if (_typeof(_this5.nodebot) === "object") {
        var node = _this5;
        setupStatus(node);

        node.nodebot.on('boardReady', function () {

          connectedStatus(node);
          var ledConfig = {
            address: node.address,
            mode: node.mode
          };

          node.nodebot.worker.postMessage({ type: 'setupNodeLed', config: ledConfig, nodeId: node.id });

          node.on('input', function (msg) {
            node.nodebot.worker.postMessage({ type: 'nodeLedMsg', nodeId: node.id, msg: msg });
          });
        });
      } else {
        _this5.warn("nodebot not configured");
      }

      return _this5;
    }

    return NodeLedNode;
  }(PN.Node);

  NodeLedNode.groupName = 'gpio';
  PN.nodes.registerType("node-led", NodeLedNode);

  var Johnny5Node = function (_PN$Node6) {
    _inherits(Johnny5Node, _PN$Node6);

    function Johnny5Node(n) {
      _classCallCheck(this, Johnny5Node);

      var _this6 = _possibleConstructorReturn(this, (Johnny5Node.__proto__ || Object.getPrototypeOf(Johnny5Node)).call(this, n));

      _this6.nodebot = PN.nodes.getNode(n.board);
      _this6.func = n.func;
      var node = _this6;

      if (_typeof(_this6.nodebot) === "object") {
        setupStatus(node);
        node.nodebot.on('boardReady', function () {
          connectedStatus(node);
          //console.log('launching Johnny5Node boardReady', n);
          node.nodebot.worker.postMessage({ type: 'run', data: node.func, nodeId: node.id });
        });

        node.nodebot.on('send_' + node.id, function (msg) {
          node.send(msg);
        });

        node.on('input', function (msg) {
          node.nodebot.worker.postMessage({ type: 'input', msg: msg, nodeId: node.id });
        });
      } else {
        node.warn("nodebot not configured");
      }

      return _this6;
    }

    return Johnny5Node;
  }(PN.Node);

  Johnny5Node.groupName = 'gpio';
  PN.nodes.registerType("johnny5", Johnny5Node);

  PN.events.on('rpc_gpio/getExamples', function (msg) {
    restCall({
      path: 'https://api.github.com/gists/f6f272f8998fd98e59ff131359ccf5ac'
    }).then(function (result) {
      msg.reply({ entity: result.entity });
    }).catch(function (err) {
      msg.reply({ error: err });
    });
  });
}

module.exports = init;