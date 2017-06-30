'use strict';

module.exports = function (PN) {

  function EventSourceListenNode(n) {
    // Create a PN node
    PN.nodes.createNode(this, n);
    var node = this;

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
  }
  EventSourceListenNode.groupName = 'eventsource';
  PN.nodes.registerType("eventsource-client", EventSourceListenNode);

  function EventSourceInNode(n) {
    PN.nodes.createNode(this, n);
    this.server = n.client ? n.client : n.server;
    var node = this;
    this.serverConfig = PN.nodes.getNode(this.server);
    this.topic = n.topic;
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
      this.error(PN._("websocket.errors.missing-conf"));
    }
  }
  EventSourceInNode.groupName = 'eventsource';
  PN.nodes.registerType("eventsource", EventSourceInNode);
};