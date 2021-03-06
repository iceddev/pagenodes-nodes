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

      var boardRows = ['firmata', 'bean', 'spark', 'imp'];
      var boardToggles = {
        firmata: 'firmata',
        "bean-io": 'bean',
        "spark-io": 'spark',
        "tinker-io": 'spark',
        "imp-io": 'imp'
      };

      function toggleBoardRows(type){
        var boardType = boardToggles[type] || 'other';
        boardRows.forEach(function(row){
          $( "#node-div-" + row + "Row" ).hide();
          if(boardType === row){
            $( "#node-div-" + row + "Row" ).show();
          }
        });
      }

      var firmataRows = ['serial', 'mqttServer', 'socketServer', 'username', 'password', 'pubTopic', 'subTopic', 'tcpHost', 'tcpPort', 'uuid', 'token', 'sendUuid', 'usb', 'firmware', 'generateId'];
      var firmataToggles = {
        local: ['serial', 'firmware'],
        "webusb-serial": ['usb'],
        "ble-serial": [],
        mqtt: ['mqttServer', 'username', 'password', 'pubTopic', 'subTopic'],
        socketio: ['socketServer', 'pubTopic', 'subTopic'],
        tcp: ['tcpHost', 'tcpPort'],
        splidi: [],
        udp: ['tcpHost', 'tcpPort']
      };

      function toggleFirmataOptions(type){
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


      console.log('prepped', self);

    },
    oneditsave: function(a) {
      console.log('saving', this, a);
    },
    render: function () {
      return (
        <div>


          <SelectRow name="boardType" label="Nodebot" icon="gears" config={true}
               options={ [
                 ['Arduino/Firmata', 'firmata'],
                 ['raspi-io', 'raspi-io'],
                 ['beaglebone-io', 'beaglebone-io'],
                 ['galileo-io', 'galileo-io'],
                 ['blend-micro-io', 'blend-micro-io'],
                 ['ble-io', 'ble-io'],
                 ['bean-io', 'bean-io'],
                 ['imp-io', 'imp-io'],
                 ['particle-io', 'particle-io'],
                 ['tinker-io', 'tinker-io'],
                 ['chip-io', 'chip-io'],

          ] }/>

            <div className="form-row" id="node-div-firmataRow">

              <SelectRow name="connectionType" label="connection type" icon="wrench" config={true}
                options={ [['MQTT', 'mqtt'],
                           ['Bluetooth Serial', 'ble-serial'],
                           ['Serial Port', 'local'],
                           ['TCP', 'tcp']] }/>


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

              <TextRow name="tcpHost" label="host" icon="globe" config={true} />

              <TextRow name="tcpPort" label="port number" icon="random" config={true} />

              <TextRow name="mqttServer" label="mqtt server" icon="globe" placeholder="mqtt://my_mqtt_server:1883" config={true} />

              <TextRow name="socketServer" label="websocket server" icon="globe" placeholder="wss://my_socket_server" config={true} />

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
