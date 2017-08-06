module.exports = function(PN){

  const {NameRow, TextRow, SearchTextRow} = PN.components;

  PN.nodes.registerType('serial-port',{
    category: 'config',
    defaults: {
      connectionType: {value:"webusb",required:true},
      serialportName: {value:"",required:false},
      baud: {value:"57600",required:false},
      inputId: {value:"",required:false},
      ouputId: {value:"",required:false},
      vendorId: {value:"",required:false},
      productId: {value:"",required:false},
      tcpHost: {value:"",required:false},
      tcpPort: {value:"",required:false},
      name: {value:""},
    },
    label: function() {
      return this.name || this.server || 'serial connection';
    },
    oneditprepare: function(a) {



      $('#needHardwareExtensionDiv').hide();
      $('#hardwareExtensionOkDiv').hide();
      $('#hardwareExtensionFirmwareDiv').hide();

      PN.comms.rpc('pluginActive', [], function(result){
        if(result.status){
          $('#hardwareExtensionOkDiv').show();
          $('#hardwareExtensionFirmwareDiv').show();
        }
        else{
          $('#needHardwareExtensionDiv').show();
        }
      });


      PN.searchField({
        name: 'serialportName',
        rpc: 'gpio/listSerial',
        config: true
      })

      PN.searchField({
        name: 'inputId',
        rpc: 'midi/listInputIDs',
        config: true
      });

      PN.searchField({
        name: 'outputId',
        rpc: 'midi/listOutputIDs',
        config: true
      });


      var usbOutput = $("#node-config-lookup-usb-output");
      //web usb handling
      if(navigator.usb){
        navigator.usb.getDevices().then(function(devices){
          usbOutput.html('Authorized Devices: ' + devices.length);
        })
          .catch(function(err){
            usbOutput.html(err);
          });

        $("#node-config-lookup-usb").click(function() {
          var DEFAULT_FILTERS = [
            { 'vendorId': 0x2341, 'productId': 0x8036 },
            { 'vendorId': 0x2341, 'productId': 0x8037 },
            { 'vendorId': 0x239a, 'productId': 0x8011 }
          ];

          navigator.usb.requestDevice({filters: DEFAULT_FILTERS })
            .then(function(device){
              console.log('authorized device', device);
              navigator.usb.getDevices().then(function(devices){
                usbOutput.html('Authorized Devices: ' + devices.length);
              })
                .catch(function(err){
                  usbOutput.html(err);
                });
            })
            .catch(function(err){
              usbOutput.html(err);
            });

        });

      }else{
        usbOutput.html('Web USB API not enabled in this browser');
      }



      var typeOptions = ['usb', 'productId', 'vendorId', 'serialportName', 'plugin', 'baud', 'tcpHost', 'tcpPort', 'inputId', 'outputId']
      var typeToggles = {
        webusb: ['usb', 'productId', 'vendorId'],
        serial: ['serialportName', 'plugin', 'baud'],
        tcp: ['tcpHost', 'tcpPort', 'plugin'],
        splidi: ['inputId', 'outputId']
      };

      function toggleOptions(type){
        var rows = typeToggles[type] || [];
        typeOptions.forEach(function(row){
          $( "#node-div-" + row + "Row" ).hide();
          rows.forEach(function(typeOpt){
            if(typeOpt === row){
              $( "#node-div-" + row + "Row" ).show();
            }
          });

        });
      }

      toggleOptions(self.connectionType);


      var connectionTypeInput = $( "#node-config-input-connectionType" );
      connectionTypeInput.change(function(){
        console.log('connectionTypeInput changed', this.value);
        try{
          toggleOptions(this.value);
        }catch(exp){}
      });



    },
    oneditsave: function(a) {
      console.log('saving serial', a, this);
    },
    render: function(){

      return(
        <div>

          <div className="form-row" id="node-div-connectionTypeRow">
            <label htmlFor="node-config-input-connectionType">
              <i className="fa fa-wrench" /> Connection
            </label>
            <select id="node-config-input-connectionType">
              <option value="webusb">WebUSB Serial</option>
              <option value="splidi">Splidi Serial</option>
              <option value="serial">Serial Port (plugin)</option>
              <option value="tcp">TCP (plugin)</option>
            </select>
          </div>

          <div className="form-row" id="node-div-pluginRow">
            <label>
            </label>
            <div id="needHardwareExtensionDiv" className="form-tips">
              This option requires you to have the <a href="https://chrome.google.com/webstore/detail/hardware-extension-for-pa/knmappkjdfbfdomfnbfhchnaamokjdpj" target="_blank"><span className="hardwareExtension">Chrome Hardware Extension</span></a> installed.
            </div>
            <div id="hardwareExtensionOkDiv" className="form-tips">
              Hardware Extension is active <i className="fa fa-thumbs-up" />
            </div>
          </div>

          <SearchTextRow name="serialportName" placeholder="e.g. /dev/ttyUSB0  COM1" label="Port" config={true} icon="random"/>

          <TextRow name="baud" placeholder="57600" config={true} />

          <div className="form-row" id="node-div-usbRow">
            <label htmlFor="node-config-input-usbName">
              Authorize USB
            </label>
            <span id="node-config-lookup-usb-output">...</span>
            <a id="node-config-lookup-usb" className="btn">
              <i
                id="node-config-lookup-usb-icon"
                className="fa fa-random" />
            </a>
          </div>


          <TextRow name="vendorId" placeholder="0x2341" config={true} />
          <TextRow name="productId" placeholder="0x8036" config={true} />
          <TextRow name="tcpHost" label="Host" config={true} />
          <TextRow name="tcpPort" label="port number" config={true} />
          <SearchTextRow name="inputId" icon="tag" config={true}/>
          <SearchTextRow name="outputId" icon="tag" config={true}/>

          <NameRow config={true} />

        </div>
      );
    },
    renderDescription: () => <p>serial connection node</p>
  });

};
