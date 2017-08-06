module.exports = function(PN){

  const {NameRow, TextRow, SearchTextRow} = PN.components;

  PN.nodes.registerType('serial in',{
    category: 'hardware',
    defaults: {
      name: {value:""},
      connection: {type:"serial-port", required: true}
    },
    color:"BurlyWood",
    inputs:0,
    outputs:1,
    faChar: "&#xf287;", //usb
    label: function() {
      return this.name||this.topic||"serial";
    },
    render: function () {
      return (
        <div>
            <TextRow name="connection" icon="globe" />
            <NameRow/>
        </div>
      );
    },
    renderHelp: function () {
      return (
        <div>
          <p>Connects to a webusb, serial, or tcp port.</p>
          <p>Emits binary (Buffer) data recieved on the port.</p>
        </div>
      );
    },
    renderDescription: () => <p>serial input node.</p>
  });


  PN.nodes.registerType('serial out',{
    category: 'hardware',
    defaults: {
      name: {value:""},
      topic: {value: "", required: false},
      connection: {type:"serial-port", required: true}
    },
    color:"BurlyWood",
    inputs:1,
    outputs:0,
    faChar: "&#xf287;", //usb
    align: "right",
    label: function() {
      return this.name||this.topic||"serial";
    },
    render: function () {
      return (
        <div>
            <TextRow name="connection" icon="globe" />
            <NameRow/>
        </div>
      );
    },
    renderHelp: function () {
      return (
        <div>
          <p>Connects to a webusb, serial, or tcp port.</p>
          <p>Writes binary (Buffer) data directly to the port.</p>
        </div>
      )
    },
    renderDescription: function () {
      return (
        <p>serial Out</p>
      )
    }
  });


};
