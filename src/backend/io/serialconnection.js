const serialport = require('serialport');
const isUtf8 = require('is-utf8');
const _ = require('lodash');

function noop() {}

function init(PN) {


  function serialPortNode(n) {
    var node = this;
    PN.nodes.createNode(node,n);
    _.assign(node, n);
    node.baud = parseInt(node.baud, 10) || 57600;

    try{

      if(n.connectionType === 'serial'){
        node.sp = new serialport.SerialPort(node.serialportName, {portName: node.serialportName, baud: node.baud, lock: false});
      }else if(n.connectionType === 'tcp' || n.connectionType === 'udp'){
        //console.log('trying', n.tcpHost, n.tcpPort);
        var options = {
          host: n.tcpHost,
          port: parseInt(n.tcpPort, 10)
        };

        node.sp = new net.Socket(options);
      }

      if(node.sp){
        if(node.connectionType === 'tcp') {
          node.sp.on('connect', function(){
            console.log('net serial open', node.sp);
            node.emit('connReady', {});
          });
        } else {
          node.sp.on('open', function(){
            console.log('serial open', node.sp);
            node.emit('connReady', {});
          });
        }


        node.sp.on('data', function(data){
          console.log('spnode data', data);
          node.emit('data', data);
        });

        node.sp.on('error', function(err){
          node.emit('connError', err);
        });


        node.on('close', function() {
          if(node.sp.close) {
            node.sp.close(noop);
          }
          if(node.sp.end) {
            node.sp.end(noop);
          }
        });

      }


    }catch(exp){
      console.log('error creating serial connection', exp);
      setTimeout(function(){
        node.emit('connError', {});
      }, 100)
      node.error(exp);
    }



  }
  serialPortNode.groupName = 'serial';
  PN.nodes.registerType("serial-port", serialPortNode);


}

module.exports = init;
