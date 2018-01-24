var _ = require('lodash');

module.exports = function(PN){
  const {NameRow, TextRow, SelectRow} = PN.components;

  const boardFirwares = {
    "uno": "StandardFirmata.cpp.hex",
    "micro": "StandardFirmata.cpp.hex",
    "imuduino": "StandardFirmata.cpp.hex",
    "leonardo": "StandardFirmata.cpp.hex",
    "blend-micro": "StandardFirmata.cpp.hex",
    "nano": "StandardFirmata.cpp.hex",
    "duemilanove168": "StandardFirmata.cpp.hex",
    "tinyduino": "StandardFirmata.cpp.hex",
    "mega": "StandardFirmata.cpp.hex",
    "sf-pro-micro": "StandardFirmata-5v.cpp.hex",
    "pro-mini": "StandardFirmata-3v.cpp.hex",
    "qduino": "StandardFirmata.cpp.hex",
    "pinoccio": "StandardFirmata.cpp.hex"
  };

  PN.nodes.registerType('nodebot',{
    category: 'config',
    defaults: {
      name: {value:"", required:false},
      username: {value:"", required:false},
      password: {value:"", required:false},
      boardType: {value:"firmata", required:true},
      serialportName: {value:"", required:false},
      connectionType: {value: "", required:false},
      mqttServer: {value:"", required:false},
      socketServer: {value:"", required:false},
      pubTopic: {value:"", required:false},
      subTopic: {value:"", required:false},
      tcpHost: {value:"", required:false},
      tcpPort: {value:"", required:false},
      sparkId: {value:"", required:false},
      sparkToken: {value:"", required:false},
      beanId: {value:"", required:false},
      impId: {value:"", required:false},
      meshbluServer: {value: "https://meshblu.octoblu.com", required:false},
      uuid: {value: "", required:false},
      token: {value: "", required:false},
      sendUuid: {value: "", required:false},
      bleServiceId: {value: "", required:false}
    },
    label: function() {
      return this.name || this.boardType;
    },
    oneditprepare: function(a) {
      var self = this;

      console.log('startup', self);

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


      var boardRows = ['firmata', 'bean', 'spark', 'imp'];
      var boardToggles = {
        firmata: 'firmata',
        "playground-io": 'playground-io',
        "bean-io": 'bean',
        "spark-io": 'spark',
        "tinker-io": 'spark',
        "imp-io": 'imp'
      };

      function toggleBoardRows(type){

        //playground will use same options as firamta, but different IO class backend
        if(type === 'playground-io') {
          type = 'firmata'
        }

        var boardType = boardToggles[type] || 'other';
        boardRows.forEach(function(row){
          $( "#node-div-" + row + "Row" ).hide();
          if(boardType === row){
            $( "#node-div-" + row + "Row" ).show();
          }
        });
      }

      var firmataRows = ['serial', 'mqttServer', 'socketServer', 'username', 'password', 'pubTopic', 'subTopic', 'tcpHost', 'tcpPort', 'meshbluServer', 'uuid', 'token', 'sendUuid', 'usb', 'plugin', 'firmware', 'generateId'];
      var firmataToggles = {
        local: ['serial', 'plugin', 'firmware'],
        "webusb-serial": ['usb'],
        "ble-serial": [],
        mqtt: ['mqttServer', 'username', 'password', 'pubTopic', 'subTopic'],
        meshblu: ['meshbluServer', 'uuid', 'token', 'sendUuid', 'generateId'],
        socketio: ['socketServer', 'pubTopic', 'subTopic'],
        tcp: ['tcpHost', 'tcpPort', 'plugin'],
        splidi: [],
        udp: ['tcpHost', 'tcpPort', 'plugin']
      };

      function toggleFirmataOptions(type){
        // console.log('toggleFirmataOptions', type);
        var firmOpts = firmataToggles[type] || [];
        firmataRows.forEach(function(row){
          $( "#node-div-" + row + "Row" ).hide();
          firmOpts.forEach(function(firmOpt){
            if(firmOpt === row){
              $( "#node-div-" + row + "Row" ).show();
            }
          });

        });
      }

      toggleBoardRows(self.boardType);

      try{
        toggleFirmataOptions(self.connectionType);
      }catch(exp){}

      var boardTypeInput = $( "#node-config-input-boardType" );
      boardTypeInput.change(function(){
        // console.log('boardTypeInput changed', this.value);
        toggleBoardRows(this.value);
      });

      var connectionTypeInput = $( "#node-config-input-connectionType" );
      connectionTypeInput.change(function(){
        // console.log('connectionTypeInput changed', this.value);
        try{
          toggleFirmataOptions(this.value);
        }catch(exp){}
      });


      try {
        $("#node-config-input-serialportName").autocomplete( "destroy" );
      } catch(err) { }
      $("#node-config-lookup-serial").click(function() {
          $("#node-config-lookup-serial-icon").removeClass('fa-search');
          $("#node-config-lookup-serial-icon").addClass('spinner');
          $("#node-config-lookup-serial").addClass('disabled');

          PN.comms.rpc('gpio/listSerial', [], function(data){
              if(data.error){
                console.log('error searching', data.error);
                return;
              }

              $("#node-config-lookup-serial-icon").addClass('fa-search');
              $("#node-config-lookup-serial-icon").removeClass('spinner');
              $("#node-config-lookup-serial").removeClass('disabled');
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

      $("#writeFirmwareButton").click(function(evt) {
        evt.preventDefault(); //WhyTF is it reloading the page?
        evt.stopPropagation();
        $("#firmwareResults").html("writing...");
        var serialBoardType = $("#serialBoardType").val();
        var serialPortNameForFirmware = $("#node-config-input-serialportName").val();
        console.log('writeFirmware', serialBoardType, serialPortNameForFirmware, boardFirwares[serialBoardType] );
        PN.comms.rpc('gpio/writeFirmware', [serialBoardType, serialPortNameForFirmware, boardFirwares[serialBoardType]], function(result){
          $("#firmwareResults").html(JSON.stringify(result));
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



      var generateButton = $('#node-config-input-generateId');

      generateButton.click(function() {
        var messageArea = $('#node-config-input-messageArea');
        messageArea.html('generating...');
        PN.comms.rpc('meshblu/register', [{
          server: $('#node-config-input-server').val(),
          port: $('#node-config-input-port').val()
        }], function(data){
          console.log('data', data);
          if(data.error){
            if(typeof err === 'object'){
              try{
                err = JSON.stringify(err);
              }catch(ex){}
            }
            messageArea.html('error: ' + err);
            return;
          }
          if(data && data.uuid && data.token){
            $('#node-config-input-uuid').val(data.uuid);
            $('#node-config-input-token').val(data.token);
          }
          messageArea.html('ok');
        });

      });

      console.log('prepped', self);

    },
    oneditsave: function(a) {
      console.log('saving', this, a);
    },
    render: function () {
      return (
        <div>


          <SelectRow name="boardType" label="Nodebot" icon="gears" config={true}
               options={ [['Arduino/Firmata', 'firmata'],
                          ['Circuit Playground', 'playground-io'],
                          ['Particle/Tinker', 'tinker-io']] }/>

            <div className="form-row" id="node-div-firmataRow">

              <SelectRow name="connectionType" label="connection type" icon="wrench" config={true}
                options={ [['MQTT', 'mqtt'],
                           ['Meshblu (skynet)', 'meshblu'],
                           ['Bluetooth Serial', 'ble-serial'],
                           ['WebUSB Serial', 'webusb-serial'],
                           ['Splidi Serial', 'splidi'],
                           ['Serial Port (plugin)', 'local'],
                           ['TCP (plugin)', 'tcp']] }/>

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

              <div className="form-row" id="node-div-serialRow">
                <label htmlFor="node-config-input-serialportName">
                <i className="fa fa-random" /> Port
                </label>
                <input
                  type="text"
                  id="node-config-input-serialportName"
                  style={{width: '60%'}}
                  placeholder="e.g. /dev/ttyUSB0  COM1" />
                <a id="node-config-lookup-serial" className="btn">
                  <i
                    id="node-config-lookup-serial-icon"
                    className="fa fa-search" />
                </a><br/>

              </div>

              <div id="node-div-firmwareRow" className="form-row" >
                <div id="hardwareExtensionFirmwareDiv" className="form-tips">
                  You may optionally write the <a href="https://github.com/firmata/arduino" target="_blank">Firmata</a> sketch to the selected board:<br/><br/>
                  <select id="serialBoardType">
                    <option value="uno">Arduino Uno</option>
                    <option value="micro">Arduino Micro</option>
                    <option value="imuduino">Femtoduino IMUduino</option>
                    <option value="leonardo">Arduino Leonardo</option>
                    <option value="blend-micro">RedBearLab Blend Micro</option>
                    <option value="nano">Arduino Nano</option>
                    <option value="duemilanove168">Arduino Duemilanove (168)</option>
                    <option value="tinyduino">Tinyduino</option>
                    <option value="mega">Arduino Mega</option>
                    <option value="sf-pro-micro">Sparkfun Pro Micro</option>
                    <option value="pro-mini">Arduino Pro Mini</option>
                    <option value="qduino">Qtechknow Qduino</option>
                    <option value="pinoccio">Pinoccio Scout</option>
                  </select>
                  <button id="writeFirmwareButton" style={{margin: '5px'}}><i className="fa fa-upload" /> write</button><br/>
                  <div id="firmwareResults"> </div>
                </div>
              </div>

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

              <TextRow name="tcpHost" label="host" icon="globe" config={true} />

              <TextRow name="tcpPort" label="port number" icon="random" config={true} />

              <TextRow name="mqttServer" label="mqtt server" icon="globe" placeholder="mqtt://my_mqtt_server:1883" config={true} />

              <TextRow name="socketServer" label="websocket server" icon="globe" placeholder="wss://my_socket_server" config={true} />

              <TextRow name="meshbluServer" label="meshblu server" icon="globe" placeholder="https://meshblu.octoblu.com" config={true} />

              <TextRow name="uuid" icon="tag" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" config={true} />

              <TextRow name="token" icon="tag" config={true} />

              <div className="form-row" id="node-div-generateIdRow">
                <a href="#" className="btn" id="node-config-input-generateId">
                  Create UUID/Token
                </a>
                <span id="node-config-input-messageArea" />
              </div>

              <TextRow name="username" icon="user" config={true} />

              <TextRow name="password" icon="lock" config={true} />

              <TextRow name="sendUuid" label="send uuid" icon="tag" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" config={true} />

              <TextRow name="pubTopic" label="publish topic" icon="tag" config={true} />

              <TextRow name="subTopic" label="subscribe topic" icon="tag" config={true} />


            </div>




            <div className="form-row" id="node-div-sparkRow">

              <TextRow name="sparkId" label="Device Id" icon="user" config={true} />

              <TextRow name="sparkToken" label="token" icon="lock" config={true} />

            </div>


            <div className="form-row" id="node-div-impRow">

              <TextRow name="impId" label="agent id" icon="user" config={true} />

            </div>

            <div className="form-row" id="node-div-beanRow">

              <TextRow name="beanId" label="UUID (optional)" icon="user" config={true} />

            </div>

            <NameRow config={true}/>

          </div>
      )
    }
  });

};
