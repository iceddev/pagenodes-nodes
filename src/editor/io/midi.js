module.exports = function(PN){

  const {NameRow, SearchTextRow} = PN.components;

  PN.nodes.registerType('midi in',{
    category: 'hardware',
    defaults: {
      name: {value:""},
      deviceId: {value: "", required: false}
    },
    color:"#DDD",
    inputs:0,
    outputs:1,
    faChar: "&#xf001;", //music
    faColor: "black",
    label: function() {
      return this.name||this.deviceId||"midi";
    },
    oneditprepare: function(a) {

      PN.searchField({
        name: 'deviceId',
        rpc: 'midi/listInputIDs'
      });

    },
    render: function () {
      return (
        <div>

          <SearchTextRow name="deviceId" label="device id" icon="tag"/>

          <NameRow/>

          <div className="form-tips" id="node-form-row-description">
          Device ID is optional. If not specified, the first MIDI device found will be used.
          </div>

        </div>
      )
    },
    renderHelp: function () {
      return (
        <div>
          <p>Connects to a midi device.</p>
          <p>Emits binary (Buffer) data recieved on the midi port.</p>
        </div>
      )
    },
    renderDescription: () => <p>midi input node.</p>
  });



  PN.nodes.registerType('midi out',{
    category: 'hardware',
    defaults: {
      name: {value:""},
      deviceId: {value: "", required: false}
    },
    color:"#DDD",
    inputs:1,
    outputs:0,
    faChar: "&#xf001;", //usb
    faColor: "black",
    align: "right",
    label: function() {
      return this.name||this.deviceId||"midi";
    },
    oneditprepare: function(a) {

      PN.searchField({
        name: 'deviceId',
        rpc: 'midi/listOutputIDs'
      })

    },
    render: function () {
      return (
        <div>

          <SearchTextRow name="deviceId" label="device id" icon="tag"/>

          <NameRow/>

          <div className="form-tips" id="node-form-row-description">
          Device ID is optional. If not specified, the first MIDI device found will be used.
          </div>

        </div>

      )
    },
    renderHelp: function () {
      return (
        <div>
          <p>Connects to a midi device.</p>
          <p>Writes binary (Buffer) data directly to the device.</p>
        </div>
      )
    },
    renderDescription: function () {
      return (
        <p>midi Out</p>
      )
    }
  });



};

