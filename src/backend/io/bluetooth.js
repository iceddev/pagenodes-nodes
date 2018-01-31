var _ = require('lodash');
var ble = require('./lib/blePeripheral');

window.Buffer = Buffer;

var lastWrite = Date.now();

function getMyCharacteristic(node){
  let retVal;
  if(ble.peripheral && ble.peripheral.services){
    ble.peripheral.services.forEach(function(service){
      if(ble.compareUUIDs(node.bleServiceId, service.uuid)){
        if(service.characteristics) {
          service.characteristics.forEach(function(characteristic){
            if(ble.compareUUIDs(node.characteristicId, characteristic.uuid)){
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


  function bluetoothInNode(n) {
    var node = this;
    PN.nodes.createNode(node,n);
    _.assign(node, n);

    function handleData(data, isNotification){
      console.log('blue in data', data, isNotification);
      if(isNotification){
        node.send({
          topic: 'bluetooth',
          payload: data
        });
      }
    }

    function getCharacteristic(){
      node.characteristic = getMyCharacteristic(node);
      console.log('ble in getCharacteristic', node.characteristic);
      if(node.characteristic){
        node.characteristic.subscribe();
        node.characteristic.on('data', handleData);
        node.status({fill:"green",shape:"dot",text:"connected"});
      }else{
        node.status({fill:"red",shape:"dot",text:"characteristic not found"});
      }

    }

    // node.status({fill:"yellow",shape:"dot",text:"connecting..."});

    if(ble.peripheral && ble.ready){
      getCharacteristic();
    }else{
      ble.events.on('ready', getCharacteristic);
    }

    function handleNobleScanStart(err){
      node.status({fill:"yellow",shape:"dot",text:"connecting..."});
    }
    ble.events.on('noble_scan_start', handleNobleScanStart);

    function handleNobleError(err){
      node.status({fill:"red",shape:"dot",text:err});
    }
    ble.events.on('noble_error', handleNobleError);

    function handleNobleDisconnect(){
      node.status({fill:"red",shape:"dot",text:'disconnected'});
    }
    ble.events.on('disconnect', handleNobleDisconnect);

    node.on('close', function() {
      ble.events.removeListener('noble_error', handleNobleError);
      ble.events.removeListener('noble_scan_start', handleNobleScanStart);
      ble.events.removeListener('disconnect', handleNobleDisconnect);
      ble.events.removeListener('ready', getCharacteristic);
      if(node.characteristic){
        node.characteristic.removeListener('data', handleData);
        node.characteristic.unsubscribe();
      }
    });
  }
  bluetoothInNode.groupName = 'notify';
  PN.nodes.registerType("bluetooth in",bluetoothInNode);



  function bluetoothOutNode(n) {
    var node = this;
    PN.nodes.createNode(node,n);
    _.assign(node, n);
    var queue = [];

    var intervalId = setInterval(function(){
      if(node.characteristic && queue.length){
        var data = queue.shift();
        node.characteristic.write(data);
      }
    }, 20);

    function getCharacteristic(){
      node.characteristic = getMyCharacteristic(node);
      console.log('ble in getCharacteristic', node.characteristic);
      if(node.characteristic){
        node.on('input',function(msg) {
          if (!Buffer.isBuffer(msg.payload)) {
            msg.payload = new Buffer(msg.payload);
          }
          queue.push(msg.payload);
        });
        node.status({fill:"green",shape:"dot",text:"connected"});
      }else{
        node.status({fill:"red",shape:"dot",text:"characteristic not found"});
      }

    }

    if(ble.peripheral && ble.ready){
      getCharacteristic();
    }else{
      ble.events.on('ready', getCharacteristic);
    }

    function handleNobleScanStart(err){
      node.status({fill:"yellow",shape:"dot",text:"connecting..."});
    }
    ble.events.on('noble_scan_start', handleNobleScanStart);

    function handleNobleError(err){
      node.status({fill:"red",shape:"dot",text:err});
    }
    ble.events.on('noble_error', handleNobleError);

    function handleNobleDisconnect(){
      node.status({fill:"red",shape:"dot",text:'disconnected'});
    }
    ble.events.on('disconnect', handleNobleDisconnect);

    node.on('close', function() {
      ble.events.removeListener('noble_error', handleNobleError);
      ble.events.removeListener('noble_scan_start', handleNobleScanStart);
      ble.events.removeListener('disconnect', handleNobleDisconnect);
      ble.events.removeListener('ready', getCharacteristic);
      clearInterval(intervalId);
    });

  }
  bluetoothOutNode.groupName = 'write';
  PN.nodes.registerType("bluetooth out",bluetoothOutNode);

}

module.exports = init;
