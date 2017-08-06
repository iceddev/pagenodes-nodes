var UsbSerial = require('webusb-serial').SerialPort;
var SplidiSerial = require('splidi-serial').SerialPort;
var isUtf8 = require('is-utf8');
var _ = require('lodash');

global.Buffer = Buffer;

function init(PN) {

  var PluginSerialPort = require('./lib/pluginPort')(PN).SerialPort;

  function serialPortNode(n) {
    var node = this;
    PN.nodes.createNode(node,n);
    _.assign(node, n);
    node.baud = parseInt(node.baud, 10) || 57600;

    try{

      if(n.connectionType === 'serial'){
        node.sp = new PluginSerialPort('serial', node.serialportName, {portName: node.serialportName, baud: node.baud});
      }
      if(n.connectionType === 'splidi'){
        node.sp = new SplidiSerial(node);
      }
      else if(n.connectionType === 'tcp' || n.connectionType === 'udp'){
        //console.log('trying', n.tcpHost, n.tcpPort);
        var options = {
          host: n.tcpHost,
          port: parseInt(n.tcpPort, 10)
        };

        node.sp = new PluginSerialPort(n.connectionType, options.tcpHost + ':' + options.tcpPort, options);
      }
      else if(n.connectionType === 'webusb'){
        var productId = parseInt(node.productId);
        var vendorId = parseInt(node.vendorId);
        var usbOptions = {};

        if(productId && vendorId){
          usbOptions.filters = [{productId, vendorId}];
        }

        node.sp = new UsbSerial(usbOptions);

      }

      if(node.sp){
        node.sp.on('open', function(){
          console.log('serial open', node.sp);
          node.emit('connReady', {});
        });

        node.sp.on('data', function(data){
          console.log('spnode data', data);
          node.emit('data', data);
        });

        node.sp.on('error', function(err){
          node.emit('connError', err);
        });
      }


    }catch(exp){
      console.log('error creating serial connection', exp);
      setTimeout(function(){
        node.emit('connError', {});
      }, 100)
      node.error(exp);
    }

    node.on('close', function() {
      if(node.sp && node.sp.close){
        node.sp.close();
      }
    });

  }
  serialPortNode.groupName = 'serial';
  PN.nodes.registerType("serial-port", serialPortNode);


}

module.exports = init;
