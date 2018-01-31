module.exports = function(PN){

  const {NameRow, TextRow} = PN.components;


  PN.nodes.registerType('bluetooth in',{
    category: 'hardware',
    defaults: {
      name: {value:""},
      deviceName: {value:""},
      characteristicId: {value: "", required: true},
      // connection: {type:"bluetooth-device", required: true}
      bleServiceId : {value:"", required: true}
    },
    color:"#0000CC",
    inputs:0,
    outputs:1,
    faChar: "&#xf294;", //bluetooth-b
    faColor: "#FFF",
    fontColor: "#FFF",
    label: function() {
      return this.name||this.deviceName||"bluetooth";
    },
    render: function () {
      return (
        <div>
          <TextRow name="deviceName" label="device name" icon="gear" />
          <TextRow name="bleServiceId" label="service" icon="gear" />
          <TextRow name="characteristicId" label="character...Id" icon="gear" />
          <NameRow/>

        </div>
      )
    },
    renderHelp: function () {
      return (
        <div>
          <p>Connects to a Bluetooth Low Energy (BLE) peripheral.</p>
          <p>Emits binary (Buffer) notifications recieved from the peripheral.</p>
        </div>
      )
    },
    renderDescription: () => <p>bluetooth input node.</p>
  });



  PN.nodes.registerType('bluetooth out',{
    category: 'hardware',
    defaults: {
      name: {value:""},
      deviceName: {value:""},
      characteristicId: {value: "", required: true},
      // connection: {type:"bluetooth-device", required: true},
      bleServiceId : {value:"", required: true}
    },
    color:"#0000CC",
    inputs:1,
    outputs:0,
    faChar: "&#xf294;", //bluetooth-b
    faColor: "#FFF",
    fontColor: "#FFF",
    align: "right",
    label: function() {
      return this.name||this.topic||"bluetooth";
    },
    render: function () {
      return (
        <div>

          <TextRow name="deviceName" label="device name" icon="gear" />
          <TextRow name="bleServiceId" label="service" icon="gear" />
          <TextRow name="characteristicId" label="char... Id" icon="gear" />
          <NameRow/>

        </div>

      )
    },
    renderHelp: function () {
      return (
        <div>
          <p>Connects to a Bluetooth Low Energy (BLE) peripheral.</p>
          <p>Writes binary (Buffer) data directly to the peripheral.</p>
        </div>
      )
    },
    renderDescription: function () {
      return (
        <p>bluetooth Out</p>
      )
    }
  });



};
