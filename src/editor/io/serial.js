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



      try {
        $("#node-config-input-serialportName").autocomplete( "destroy" );
      } catch(err) { }
      $("#node-config-input-serialportName-lookup").click(function() {
        $("#node-config-input-serialportName-lookup-icon").removeClass('fa-search');
        $("#node-config-input-serialportName-lookup-icon").addClass('spinner');
        $("#node-config-input-serialportName-lookup").addClass('disabled');

        PN.comms.rpc('gpio/listSerial', [], function(data){
          if(data.error){
            console.log('error searching', data.error);
            return;
          }

          $("#node-config-input-serialportName-lookup-icon").addClass('fa-search');
          $("#node-config-input-serialportName-lookup-icon").removeClass('spinner');
          $("#node-config-input-serialportName-lookup").removeClass('disabled');
          var ports = [];
          $.each(data, function(i, port){
            ports.push(port);
          });
          $("#node-config-input-serialportName").autocomplete({
            source:ports,
            minLength:0,
            close: function( event, ui ) {
              $("#node-config-input-serialportName").autocomplete( "destroy" );
            }
          }).autocomplete("search","");
        });

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
          <TextRow name="inputId" config={true} />
          <TextRow name="outputId" config={true} />

          <NameRow config={true} />

        </div>
      );
    },
    renderDescription: () => <p>serial connection node</p>
  });

};

