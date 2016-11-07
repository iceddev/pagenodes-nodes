const sensorTypes = require('../../shared/nodes/websensors');
const {map} = require('lodash');

module.exports = function(PN){
  PN.nodes.registerType('web sensor',{
    category: 'robotics',
    color: "#DA523F",
    defaults: {
      name: {value:""},
      sensorType: {value: "AmbientLightSensor",requied: true}
    },
    color:"#f6de1d",
    inputs:0,
    outputs:1,
    faChar: "&#xf0ac;", //globe
    faColor: "black",
    label: function() {
      return this.name|| this.sensorType;
    },
    render: function () {
      const {NameRow, SelectRow} = PN.components;
      return (
        <div>
          <SelectRow name="sensorType" label="type" options={map(sensorTypes, (name, type) => [name, type] )}/>
          <NameRow/>
        </div>
      )
    },
    renderHelp: function () {
      return (
        <div>
          <p>
            This node uses the <a href="https://w3c.github.io/sensors/"> Web Sensor</a> API.
            <br/>
            In chrome, you may need to enable this flag: <a href="chrome://flags/#enable-generic-sensor">chrome://flags/#enable-generic-sensor</a>
          </p>
        </div>
      )
    },
    renderDescription: () => <p>AmbientLightSensor node</p>
  });
};

