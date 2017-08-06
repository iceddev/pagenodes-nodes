module.exports = function(PN){

  const {NameRow, TextRow, SearchTextRow} = PN.components;

  PN.nodes.registerType('serial-port',{
    category: 'config',
    defaults: {
      connectionType: {value:"serial",required:true},
      serialportName: {value:"",required:false},
      baud: {value:"57600",required:false},
      tcpHost: {value:"",required:false},
      tcpPort: {value:"",required:false},
      name: {value:""},
    },
    label: function() {
      return this.name || this.server || 'serial connection';
    },
    oneditprepare: function(a) {


      PN.searchField({
        name: 'serialportName',
        rpc: 'gpio/listSerial',
        config: true
      })


      var typeOptions = ['serialportName', 'baud', 'tcpHost', 'tcpPort']
      var typeToggles = {
        serial: ['serialportName', 'plugin', 'baud'],
        tcp: ['tcpHost', 'tcpPort', 'plugin']
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
              <option value="serial">Serial Port</option>
              <option value="tcp">TCP</option>
            </select>
          </div>

          <SearchTextRow name="serialportName" placeholder="e.g. /dev/ttyUSB0  COM1" label="Port" config={true} icon="random"/>

          <TextRow name="baud" placeholder="57600" config={true} />

          <TextRow name="tcpHost" label="Host" config={true} />
          <TextRow name="tcpPort" label="port number" config={true} />

          <NameRow config={true} />

        </div>
      );
    },
    renderDescription: () => <p>serial connection node</p>
  });

};
