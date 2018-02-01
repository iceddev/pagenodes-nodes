'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');

var globalContext = require('../../globalContext');
var serialport = require('serialport');

//for cleanup
// const eventTypes = ['data', 'change', 'up', 'down', 'hit', 'hold', 'press', 'release', 'start', 'stop', 'navigation', 'motionstart', 'motionend'];


function listArduinoPorts(callback) {
  return serialport.list(function (err, ports) {
    if (err) {
      return callback(err);
    }
    var devices = [];
    for (var i = 0; i < ports.length; i++) {
      if (/usb|acm|com\d+/i.test(ports[i].comName)) {
        devices.push(ports[i].comName);
      }
    }
    return callback(null, devices);
  });
}

function createNode(PN) {
  var NodeBotNode = function (_PN$Node) {
    _inherits(NodeBotNode, _PN$Node);

    function NodeBotNode(n) {
      _classCallCheck(this, NodeBotNode);

      var _this = _possibleConstructorReturn(this, (NodeBotNode.__proto__ || Object.getPrototypeOf(NodeBotNode)).call(this, n));

      var node = _this;
      node.boardType = n.boardType;

      function sendToWorker(data) {
        data.id = node.id;
        PN.events.emit('messageWorker', data);
      }

      node.worker = {
        postMessage: sendToWorker
      };

      function handleWorkerMessages(data) {
        // console.log('fromWorker_' + node.id, data);
        try {
          var type = data.type;
          // console.log('j5 node onmessage', type, data);
          if (type === 'serial' && data.data && node.sp) {
            node.sp.write(data.data);
          } else if (type === 'workerStarted') {
            PN.events.emit('messageWorker', { id: node.id, config: n, type: 'initializeJ5Worker' });
          } else if (type === 'j5WorkerInitialized') {
            PN.events.emit('messageWorker', { id: node.id, config: n, type: 'startJ5' });
          } else if (type === 'boardReady') {
            // connectedStatus(node);
            // node.worker.postMessage({type: 'run', data: node.func});
            node.emit('boardReady', {});
          } else if (type === 'networkReady') {
            // connectedStatus(node);
            // node.worker.postMessage({type: 'run', data: node.func});
            node.emit('networkReady', {});
          } else if (type === 'pixelReady') {
            node.emit('pixelReady', { nodeId: data.nodeId });
          } else if (type === 'error') {
            node.error(data.message);
            node.emit('ioError', { nodeId: data.nodeId, message: data.message });
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
      }

      // node.worker.postMessage({type: 'startJ5', options: _.clone(n)});
      node.emit('boardLaunching', {});
      // node.worker.startJ5(n);

      node.on('close', function () {
        console.log('terminating worker for ', node.id);
        PN.events.removeListener('fromWorker_' + node.id, handleWorkerMessages);
        PN.events.emit('killWorker', { id: node.id });
      });

      PN.events.on('fromWorker_' + node.id, handleWorkerMessages);
      PN.events.emit('createWorker', { id: node.id });

      return _this;
    }

    return NodeBotNode;
  }(PN.Node);

  NodebotNode.groupName = 'gpio';
  PN.nodes.registerType("nodebot", NodebotNode);

  PN.events.on('rpc_gpio/listSerial', function (msg) {
    // console.log('rpc_gpio/listSerial', msg);
    listArduinoPorts(function (err, ports) {
      msg.reply(ports);
    });
  });

  // PN.events.on('rpc_gpio/writeFirmware', function(msg){
  //   PN.plugin.rpc('writeFirmware', msg.params, function(result){
  //     msg.reply(result);
  //   });
  // });

  return NodebotNode;
}

module.exports = createNode;