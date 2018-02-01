
const sensorTypes = require('../../shared/nodes/websensors');


module.exports = function(PN) {

  class WebSensorNode extends PN.Node {
    constructor(config) {
      super(config)
      var node = this;
      node.sensorType = config.sensorType;

      if(!sensorTypes[node.sensorType] || !window[node.sensorType]){
        return node.error(new Error('Sensor ' + node.sensorType + ' not supported in this browser'));
      }


      let sensor = new window[node.sensorType]();
      sensor.start();

      sensor.onchange = function(event) {
        // console.log(event.reading);

        node.send({
          topic: 'web sensor',
          sensorType: node.sensorType,
          payload: event.target.reading
        });
      };

      sensor.onerror = function(event) {
          node.error(event.error);
          // console.log(event.error.name, event.error.message);
      };

      node.on('close', function(){
        sensor.stop();
      });
    }
  }
  PN.nodes.registerType("web sensor",WebSensorNode);
};
