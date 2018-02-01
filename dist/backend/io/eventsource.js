'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var EventSourceListenNode = function (_PN$Node) {
    _inherits(EventSourceListenNode, _PN$Node);

    function EventSourceListenNode(n) {
      _classCallCheck(this, EventSourceListenNode);

      var _this = _possibleConstructorReturn(this, (EventSourceListenNode.__proto__ || Object.getPrototypeOf(EventSourceListenNode)).call(this, n));

      var node = _this;

      // Store local copies of the node configuration (as defined in the .html)
      node.path = n.path;
      node._clients = {};
      // match absolute url
      node.isServer = false;
      node.closing = false;
      node.connected = true;

      function startconn() {

        try {
          console.log('starting eventsource', node.path);
          node.eventSource = new EventSource(node.path);

          node.emit('launched', '');

          node.errorListener = function (e) {
            console.log('error connecting to EventSource', e);
            node.emit('erro', e);
            node.connected = false;
          };

          node.openListener = function (e) {
            console.log('onopen connecting to EventSource', e);
            node.connected = true;
          };

          node.messageListener = function (e) {
            node.emit('message', e);
          };

          node.eventSource.addEventListener('error', node.errorListnener);
          node.eventSource.addEventListener('open', node.openListener);
          node.eventSource.addEventListener('message', node.messageListener);

          setTimeout(function () {
            //stupid timing problem
            if (node.connected) {
              node.emit('opened', '');
            }
          }, 200);
        } catch (err) {
          console.log('caught error connecting to EventSource', err);
          node.emit('erro', err);
        }
      }

      node.closing = false;
      if (window.EventSource) {
        startconn(); // start outbound connection
      } else {
        node.error(new Error('EventSource not supported in this browser'));
      }

      node.on("close", function () {
        node.closing = true;
        if (node.openListener) {
          node.eventSource.removeEventListener('open', node.openListener);
        }
        if (node.messageListener) {
          node.eventSource.removeEventListener('message', node.messageListener);
        }
        if (node.errorListener) {
          node.eventSource.removeEventListener('error', node.errorListener);
        }
        node.emit('closed', '');
      });
      return _this;
    }

    return EventSourceListenNode;
  }(PN.Node);

  EventSourceListenNode.groupName = 'eventsource';
  PN.nodes.registerType("eventsource-client", EventSourceListenNode);

  var EventSourceInNode = function (_PN$Node2) {
    _inherits(EventSourceInNode, _PN$Node2);

    function EventSourceInNode(n) {
      _classCallCheck(this, EventSourceInNode);

      var _this2 = _possibleConstructorReturn(this, (EventSourceInNode.__proto__ || Object.getPrototypeOf(EventSourceInNode)).call(this, n));

      _this2.server = n.client ? n.client : n.server;
      var node = _this2;
      _this2.serverConfig = PN.nodes.getNode(_this2.server);
      _this2.topic = n.topic;
      if (node.serverConfig) {

        node.serverConfig.on('opened', function (n) {
          node.status({ fill: "green", shape: "dot", text: "connected " + n });

          if (node.topic) {
            node.topicListener = function (e) {
              var msg = {
                topic: node.topic,
                payload: e.data
              };
              node.send(msg);
            };
            node.serverConfig.eventSource.addEventListener(node.topic, node.topicListener);
          } else {
            node.serverConfig.on('message', function (e) {
              var msg = {
                topic: 'message',
                payload: e.data
              };
              node.send(msg);
            });
          }
        });

        node.on("close", function () {
          if (node.topicListener) {
            node.serverConfig.eventSource.removeEventListener(node.topic, node.topicListener);
          }
        });

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

    return EventSourceInNode;
  }(PN.Node);

  EventSourceInNode.groupName = 'eventsource';
  PN.nodes.registerType("eventsource", EventSourceInNode);
};