'use strict';

var _ = require('lodash');
var WW_SCRIPT = '/j5-worker.bundle.js';
var globalContext = require('../../globalContext');
var ble = require('./blePeripheral');

function noop() {}

//for cleanup
// const eventTypes = ['data', 'change', 'up', 'down', 'hit', 'hold', 'press', 'release', 'start', 'stop', 'navigation', 'motionstart', 'motionend'];


function createNode(PN) {

  var PluginSerialPort = require('./pluginPort')(PN).SerialPort;

  function launchSerial(node, n) {
    node.sp.on('open', function () {
      // console.log('serial open');
      node.emit('networkReady', node.io);
      node.worker.postMessage({ type: 'startJ5', options: _.clone(n) });
    });

    node.sp.on('data', function (data) {
      node.worker.postMessage({ type: 'serial', data: data });
    });

    node.sp.on('error', function (err) {
      node.emit('ioError', err);
    });
  }

  function connectSerial(node, n) {

    if (n.boardType === 'firmata') {
      var VirtualSerialPort, client;
      if (n.connectionType === 'local') {
        node.sp = new PluginSerialPort('serial', n.serialportName, { portName: n.serialportName });
      } else if (n.connectionType === 'mqtt') {
        var mqtt = require('mqtt');
        VirtualSerialPort = require('mqtt-serial').SerialPort;

        client = mqtt.connect(n.mqttServer, { username: n.username, password: n.password });
        client.on('error', function (err) {
          node.warn(err);
        });
        node.client = client;
        node.sp = new VirtualSerialPort({
          client: client,
          transmitTopic: n.pubTopic,
          receiveTopic: n.subTopic
        });
      } else if (n.connectionType === 'meshblu') {
        try {
          require('node-rsa');
        } catch (exp) {}
        var meshblu = require('meshblu');
        VirtualSerialPort = require('meshblu-virtual-serial').SerialPort;

        client = meshblu.createConnection({
          uuid: n.uuid,
          token: n.token,
          server: n.meshbluServer
        });

        client.once('ready', function (data) {
          node.sp.emit('open', {});
        });
        node.sp = new VirtualSerialPort(client, n.sendUuid);
        node.client = client;
      } else if (n.connectionType === 'webusb-serial') {
        VirtualSerialPort = require('webusb-serial').SerialPort;
        node.sp = new VirtualSerialPort();
      } else if (n.connectionType === 'ble-serial') {
        console.log('connection type ble-serial');
        VirtualSerialPort = require('ble-serial').SerialPort;
        ble.events.once('ready', function () {
          console.log('ble peripheral ready for ble-serial', ble);
          node.sp = new VirtualSerialPort({ peripheral: ble.peripheral });
          launchSerial(node, n);
        });
      } else if (n.connectionType === 'tcp' || n.connectionType === 'udp') {
        //console.log('trying', n.tcpHost, n.tcpPort);
        var options = {
          host: n.tcpHost,
          port: parseInt(n.tcpPort, 10)
        };

        node.sp = new PluginSerialPort(n.connectionType, options.host + ':' + options.port, options);
      }
    } else if ('tinker-io' === n.boardType) {

      try {
        node.io = new boardModule({ deviceId: n.sparkId, token: n.sparkToken, username: n.particleUsername, password: n.particlePassword });
        // start(node);
      } catch (exp) {
        console.log('error initializing spark-io class', n.boardType, exp);
        process.nextTick(function () {
          node.emit('ioError', exp);
        });
      }
    }

    if (node.sp) {
      launchSerial(node, n);
    }
  }

  function nodebotNode(n) {
    PN.nodes.createNode(this, n);
    var node = this;
    node.boardType = n.boardType;

    node.worker = new Worker(WW_SCRIPT);
    node.worker.onmessage = function (evt) {
      try {
        var data = evt.data;
        var type = data.type;
        // console.log('j5 node onmessage', type, data);
        if (type === 'serial' && data.data && node.sp) {
          node.sp.write(data.data);
        } else if (type === 'workerReady') {
          node.emit('workerReady', node);
          if (node.boardType === 'firmata') {
            connectSerial(node, n);
          } else {
            node.worker.postMessage({ type: 'startJ5', options: _.clone(n) });
          }
        } else if (type === 'boardReady') {
          // connectedStatus(node);
          // node.worker.postMessage({type: 'run', data: node.func});
          node.emit('boardReady', {});
        } else if (type === 'pixelReady') {
          node.emit('pixelReady', { nodeId: data.nodeId });
        } else if (type === 'error') {
          node.error(new Error(data.message));
        } else if (type === 'warn') {
          node.warn(data.error);
        } else if (type === 'log') {
          node.log(data.msg);
        } else if (type === 'status') {
          node.status(data.status);
        } else if (type === 'send' && data.msg) {
          // console.log('send from worker', data, 'send_' + data.nodeId);
          node.emit('send_' + data.nodeId, data.msg);
        } else if (type === 'inputSubscription') {
          node.emit('inputSubscription_' + data.nodeId, data.value);
        } else if (type === 'globalSet' && data.rpcId) {
          globalContext[data.key] = data.value;
          node.worker.postMessage({ rpcId: data.rpcId, type: 'rpc' });
        } else if (type === 'globalGet' && data.rpcId) {
          var value = globalContext[data.key];
          node.worker.postMessage({ rpcId: data.rpcId, type: 'rpc', value: value });
        }
      } catch (exp) {
        node.error(exp);
      }
    };

    node.on('close', function () {
      // console.log('terminating j5 worker for ', node.id);
      node.worker.terminate();

      try {
        if (node.sp.sp) {
          if (node.sp.close) {
            node.sp.close(noop);
          } else if (node.sp.end) {
            node.sp.end(noop);
          }
        }

        if (node.client && node.client.stop) {
          node.client.stop(noop);
        }
        if (node.client && node.client.close) {
          node.client.close(noop);
        }
      } catch (exp) {
        console.log('error closing', exp);
      }
    });
  }
  nodebotNode.groupName = 'gpio';
  PN.nodes.registerType("nodebot", nodebotNode);

  PN.events.on('rpc_gpio/listSerial', function (msg) {
    console.log('rpc_gpio/listSerial', msg);
    PN.plugin.rpc('listSerial', [], function (result) {
      msg.reply(result);
    });
  });

  PN.events.on('rpc_gpio/writeFirmware', function (msg) {
    PN.plugin.rpc('writeFirmware', msg.params, function (result) {
      msg.reply(result);
    });
  });

  return nodebotNode;
}

module.exports = createNode;