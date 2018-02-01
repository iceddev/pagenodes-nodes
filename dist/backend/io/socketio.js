"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var ioclient = require("socket.io-client");

  var SocketIOListenNode = function (_PN$Node) {
    _inherits(SocketIOListenNode, _PN$Node);

    function SocketIOListenNode(n) {
      _classCallCheck(this, SocketIOListenNode);

      var _this = _possibleConstructorReturn(this, (SocketIOListenNode.__proto__ || Object.getPrototypeOf(SocketIOListenNode)).call(this, n));

      var node = _this;

      // Store local copies of the node configuration (as defined in the .html)
      node.path = n.path;
      node.wholemsg = n.wholemsg === "true";

      node._inputNodes = []; // collection of nodes that want to receive events
      node._clients = {};
      // match absolute url
      node.isServer = false;
      node.closing = false;

      function startconn() {
        // Connect to remote endpoint
        var socket = ioclient.connect(node.path, { multiplex: false });
        node.server = socket; // keep for closing
        handleConnection(socket);
      }

      function handleConnection( /*socket*/socket) {

        console.log('socketio handleConnection', socket);

        var id = PN.util.generateId();
        if (node.isServer) {
          node._clients[id] = socket;node.emit('opened', Object.keys(node._clients).length);
        }
        socket.on('connect', function () {
          console.log('socketio-client connect event');
          setTimeout(function () {
            //stupid timing problem
            node.emit('opened', '');
          }, 500);
        });
        socket.on('reconnect', function () {
          console.log('socketio-client reconnect event');
          setTimeout(function () {
            //stupid timing problem
            node.emit('opened', '');
          }, 500);
        });

        socket.on('close', function () {
          node.emit('closed');
          if (!node.closing && !node.isServer) {
            node.tout = setTimeout(function () {
              startconn();
            }, 3000); // try to reconnect every 3 secs... bit fast ?
          }
        });
        socket.on('error', function (err) {
          node.emit('erro');
          node.error('error connecting socket.io', err);
          if (!node.closing && !node.isServer) {
            node.tout = setTimeout(function () {
              startconn();
            }, 3000); // try to reconnect every 3 secs... bit fast ?
          }
        });
        node.emit('launched', '');
      }

      node.closing = false;
      startconn(); // start outbound connection

      node.on("close", function () {
        console.log('socketio-client closing', node);
        node.closing = true;
        node.server.close();
        node.emit('closed', '');
      });
      return _this;
    }

    _createClass(SocketIOListenNode, [{
      key: "broadcast",
      value: function broadcast(data) {
        try {
          if (this.isServer) {
            for (var i = 0; i < this.server.clients.length; i++) {
              this.server.clients[i].send(data);
            }
          } else {
            this.server.send(data);
          }
        } catch (e) {
          // swallow any errors
          this.warn("ws:" + i + " : " + e);
        }
      }
    }, {
      key: "reply",
      value: function reply(id, data) {
        var session = this._clients[id];
        if (session) {
          try {
            session.send(data);
          } catch (e) {// swallow any errors
          }
        }
      }
    }]);

    return SocketIOListenNode;
  }(PN.Node);

  SocketIOListenNode.groupName = 'socketio';
  PN.nodes.registerType("socketio-client", SocketIOListenNode);

  var SocketIOInNode = function (_PN$Node2) {
    _inherits(SocketIOInNode, _PN$Node2);

    function SocketIOInNode(n) {
      _classCallCheck(this, SocketIOInNode);

      var _this2 = _possibleConstructorReturn(this, (SocketIOInNode.__proto__ || Object.getPrototypeOf(SocketIOInNode)).call(this, n));

      _this2.server = n.client ? n.client : n.server;
      var node = _this2;
      _this2.serverConfig = PN.nodes.getNode(_this2.server);
      _this2.topic = n.topic;
      if (node.serverConfig) {

        node.serverConfig.on('opened', function (n) {
          node.status({ fill: "green", shape: "dot", text: "connected " + n });
          node.serverConfig.server.on(node.topic, function (data) {
            if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === 'object') {
              data.topic = node.topic;
              node.send(data);
            } else {
              node.send({
                topic: node.topic,
                payload: data
              });
            }
          });
        });
        node.serverConfig.on('launched', function (n) {});

        node.serverConfig.on('erro', function () {
          node.status({ fill: "red", shape: "ring", text: "error" });
        });
        node.serverConfig.on('closed', function () {
          node.status({ fill: "red", shape: "ring", text: "disconnected" });
        });
      } else {
        _this2.error(PN._("websocket.errors.missing-conf"));
      }

      return _this2;
    }

    return SocketIOInNode;
  }(PN.Node);

  SocketIOInNode.groupName = 'socketio';
  PN.nodes.registerType("socketio in", SocketIOInNode);

  var SocketIOOutNode = function (_PN$Node3) {
    _inherits(SocketIOOutNode, _PN$Node3);

    function SocketIOOutNode(n) {
      _classCallCheck(this, SocketIOOutNode);

      var _this3 = _possibleConstructorReturn(this, (SocketIOOutNode.__proto__ || Object.getPrototypeOf(SocketIOOutNode)).call(this, n));

      var node = _this3;
      _this3.server = n.client ? n.client : n.server;
      _this3.serverConfig = PN.nodes.getNode(_this3.server);
      console.log('new SocketIOOutNode', n);
      if (!_this3.serverConfig) {
        _this3.error(PN._("websocket.errors.missing-conf"));
      } else {
        _this3.serverConfig.on('opened', function (n) {
          node.status({ fill: "green", shape: "dot", text: "connected " + n });
        });
        _this3.serverConfig.on('erro', function () {
          node.status({ fill: "red", shape: "ring", text: "error" });
        });
        _this3.serverConfig.on('closed', function () {
          node.status({ fill: "red", shape: "ring", text: "disconnected" });
        });
      }
      _this3.on("input", function (msg) {
        if (msg.topic && node.serverConfig) {
          node.serverConfig.server.emit(msg.topic, msg);
        }
      });
      return _this3;
    }

    return SocketIOOutNode;
  }(PN.Node);

  SocketIOOutNode.groupName = 'socketio';
  PN.nodes.registerType("socketio out", SocketIOOutNode);
};