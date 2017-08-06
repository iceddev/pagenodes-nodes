"use strict";

var _ = require('lodash');

global.Buffer = Buffer;

function init(PN) {

  function serialInNode(n) {
    var node = this;
    PN.nodes.createNode(node, n);
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
  }
  serialInNode.groupName = 'serial';
  PN.nodes.registerType("serial in", serialInNode);

  function serialOutNode(n) {
    var node = this;
    PN.nodes.createNode(node, n);
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
  }

  serialOutNode.groupName = 'serial';
  PN.nodes.registerType("serial out", serialOutNode);
}

module.exports = init;