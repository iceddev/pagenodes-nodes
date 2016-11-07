module.exports = function(PN){
  PN.nodes.registerType('orientation',{
    category: 'hardware',
    color: "#DA523F",
    defaults: {
      name: {value:""},
      refreshInterval: {value: "300", required: false}
    },
    inputs:0,
    outputs:1,
    faChar: "&#xf079;", //retweet
    fontColor: "#FFF",
    label: function() {
      return this.name||'orientation';
    },
    labelStyle: function() {
      return this.name?"node_label_italic":"";
    },
    render: function () {
      const {NameRow, TextRow} = PN.components;
      return (
        <div>
          <TextRow name="refreshInterval" label="Interval (ms)" icon="clock-o" placeholder="300" />
          <NameRow/>
        </div>
      )
    },
    renderHelp: function () {
      return (
        <div>
          <p>
            <b>This node will only work on devices with accelerometers</b>
          </p>
          <p>
            This node uses the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation">Device Orientation</a> API in order to find out the accelerometers on your mobile device.  You can use this for situations where you need to control a devices hardware from the movement of an accelerometer
          </p>
        </div>
      )
    },
    renderDescription: () => <p>Accelerometer node</p>
  });
};

