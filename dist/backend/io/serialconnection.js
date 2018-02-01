'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var serialport = require('serialport');
var isUtf8 = require('is-utf8');
var _ = require('lodash');

function noop() {}

function init(PN) {
  var SerialPortNode = function (_PN$Node) {
    _inherits(SerialPortNode, _PN$Node);

    function SerialPortNode(n) {
      _classCallCheck(this, SerialPortNode);

      var _this = _possibleConstructorReturn(this, (SerialPortNode.__proto__ || Object.getPrototypeOf(SerialPortNode)).call(this, n));

      var node = _this;
      _.assign(node, n);
      node.baud = parseInt(node.baud, 10) || 57600;

      try {

        if (n.connectionType === 'serial') {
          node.sp = new serialport.SerialPort(node.serialportName, { portName: node.serialportName, baud: node.baud, lock: false });
        } else if (n.connectionType === 'tcp' || n.connectionType === 'udp') {
          //console.log('trying', n.tcpHost, n.tcpPort);
          var options = {
            host: n.tcpHost,
            port: parseInt(n.tcpPort, 10)
          };

          node.sp = new net.Socket(options);
        }

        if (node.sp) {
          node.emit('connInit', {});
          if (node.connectionType === 'tcp') {
            node.sp.on('connect', function () {
              console.log('net serial open', node.sp);
              node.emit('connReady', {});
            });
          } else {
            node.sp.on('open', function () {
              console.log('serial open', node.sp);
              node.emit('connReady', {});
            });
          }

          node.sp.on('data', function (data) {
            console.log('spnode data', data);
            node.emit('data', data);
          });

          node.sp.on('error', function (err) {
            node.emit('connError', err);
          });

          node.on('close', function () {
            if (node.sp.close) {
              node.sp.close(noop);
            }
            if (node.sp.end) {
              node.sp.end(noop);
            }
          });
        }
      } catch (exp) {
        console.log('error creating serial connection', exp);
        setTimeout(function () {
          node.emit('connError', {});
        }, 100);
        node.error(exp);
      }

      return _this;
    }

    return SerialPortNode;
  }(PN.Node);

  SerialPortNode.groupName = 'serial';
  PN.nodes.registerType("serial-port", SerialPortNode);
}

module.exports = init;