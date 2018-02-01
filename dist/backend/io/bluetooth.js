'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');
var ble = require('./lib/blePeripheral');

window.Buffer = Buffer;

var lastWrite = Date.now();

function getMyCharacteristic(node) {
  var retVal = void 0;
  if (ble.peripheral && ble.peripheral.services) {
    ble.peripheral.services.forEach(function (service) {
      if (ble.compareUUIDs(node.bleServiceId, service.uuid)) {
        if (service.characteristics) {
          service.characteristics.forEach(function (characteristic) {
            if (ble.compareUUIDs(node.characteristicId, characteristic.uuid)) {
              retVal = characteristic;
            }
          });
        }
      }
    });
  }
  return retVal;
}

function init(PN) {

  ble.init(PN);

  var BluetoothInNode = function (_PN$Node) {
    _inherits(BluetoothInNode, _PN$Node);

    function BluetoothInNode(n) {
      _classCallCheck(this, BluetoothInNode);

      var _this = _possibleConstructorReturn(this, (BluetoothInNode.__proto__ || Object.getPrototypeOf(BluetoothInNode)).call(this, n));

      var node = _this;
      _.assign(node, n);

      function handleData(data, isNotification) {
        console.log('blue in data', data, isNotification);
        if (isNotification) {
          node.send({
            topic: 'bluetooth',
            payload: data
          });
        }
      }

      function getCharacteristic() {
        node.characteristic = getMyCharacteristic(node);
        console.log('ble in getCharacteristic', node.characteristic);
        if (node.characteristic) {
          node.characteristic.subscribe();
          node.characteristic.on('data', handleData);
          node.status({ fill: "green", shape: "dot", text: "connected" });
        } else {
          node.status({ fill: "red", shape: "dot", text: "characteristic not found" });
        }
      }

      // node.status({fill:"yellow",shape:"dot",text:"connecting..."});

      if (ble.peripheral && ble.ready) {
        getCharacteristic();
      } else {
        ble.events.on('ready', getCharacteristic);
      }

      function handleNobleScanStart(err) {
        node.status({ fill: "yellow", shape: "dot", text: "connecting..." });
      }
      ble.events.on('noble_scan_start', handleNobleScanStart);

      function handleNobleError(err) {
        node.status({ fill: "red", shape: "dot", text: err });
      }
      ble.events.on('noble_error', handleNobleError);

      function handleNobleDisconnect() {
        node.status({ fill: "red", shape: "dot", text: 'disconnected' });
      }
      ble.events.on('disconnect', handleNobleDisconnect);

      node.on('close', function () {
        ble.events.removeListener('noble_error', handleNobleError);
        ble.events.removeListener('noble_scan_start', handleNobleScanStart);
        ble.events.removeListener('disconnect', handleNobleDisconnect);
        ble.events.removeListener('ready', getCharacteristic);
        if (node.characteristic) {
          node.characteristic.removeListener('data', handleData);
          node.characteristic.unsubscribe();
        }
      });
      return _this;
    }

    return BluetoothInNode;
  }(PN.Node);

  BluetoothInNode.groupName = 'notify';
  PN.nodes.registerType("bluetooth in", BluetoothInNode);

  var BluetoothOutNode = function (_PN$Node2) {
    _inherits(BluetoothOutNode, _PN$Node2);

    function BluetoothOutNode(n) {
      _classCallCheck(this, BluetoothOutNode);

      var _this2 = _possibleConstructorReturn(this, (BluetoothOutNode.__proto__ || Object.getPrototypeOf(BluetoothOutNode)).call(this, n));

      var node = _this2;
      _.assign(node, n);
      var queue = [];

      var intervalId = setInterval(function () {
        if (node.characteristic && queue.length) {
          var data = queue.shift();
          node.characteristic.write(data);
        }
      }, 20);

      function getCharacteristic() {
        node.characteristic = getMyCharacteristic(node);
        console.log('ble in getCharacteristic', node.characteristic);
        if (node.characteristic) {
          node.on('input', function (msg) {
            if (!Buffer.isBuffer(msg.payload)) {
              msg.payload = new Buffer(msg.payload);
            }
            queue.push(msg.payload);
          });
          node.status({ fill: "green", shape: "dot", text: "connected" });
        } else {
          node.status({ fill: "red", shape: "dot", text: "characteristic not found" });
        }
      }

      if (ble.peripheral && ble.ready) {
        getCharacteristic();
      } else {
        ble.events.on('ready', getCharacteristic);
      }

      function handleNobleScanStart(err) {
        node.status({ fill: "yellow", shape: "dot", text: "connecting..." });
      }
      ble.events.on('noble_scan_start', handleNobleScanStart);

      function handleNobleError(err) {
        node.status({ fill: "red", shape: "dot", text: err });
      }
      ble.events.on('noble_error', handleNobleError);

      function handleNobleDisconnect() {
        node.status({ fill: "red", shape: "dot", text: 'disconnected' });
      }
      ble.events.on('disconnect', handleNobleDisconnect);

      node.on('close', function () {
        ble.events.removeListener('noble_error', handleNobleError);
        ble.events.removeListener('noble_scan_start', handleNobleScanStart);
        ble.events.removeListener('disconnect', handleNobleDisconnect);
        ble.events.removeListener('ready', getCharacteristic);
        clearInterval(intervalId);
      });

      return _this2;
    }

    return BluetoothOutNode;
  }(PN.Node);

  BluetoothOutNode.groupName = 'write';
  PN.nodes.registerType("bluetooth out", BluetoothOutNode);
}

module.exports = init;