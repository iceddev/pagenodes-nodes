const stringFunctions = require('../../shared/nodes/strings').stringFunctions;
const _ = require('lodash');

module.exports = function(PN){

    PN.nodes.registerType('strings',{
        category: 'function',      // the palette category
        color:"#66d9ef", // yellow like other function nodes
        defaults: {             // defines the editable properties of the node
          name: {value:""},   //  along with default values.
          func: {value:"camelCase", required:true},
          param2: {value:"", required: false},
          param2Type: {value:"str", required: false},
          param3: {value:"", required: false},
          param3Type: {value:"str", required: false},
          payloadProp: {value:"payload", required:false},
          resultProp: {value:"payload", required:false},
          payloadPropType: {value:"msg", required:false},
          resultPropType: {value:"msg", required:false},
        },
        inputs:1,   // set the number of inputs - only 0 or 1
        outputs:1,  // set the number of outputs - 0 to n
        faChar: "&#xf0cc;",  // 's' text icon
        label: function() {
            return this.name||this.func;
        },
        labelStyle: function() {
            return this.name?"node_label_italic":"";
        },

        oneditprepare: function() {

          PN.util.setupTypedText({name: 'payloadProp', node: this, types: ['msg','str','num','bool','json']});
          PN.util.setupTypedText({name: 'resultProp', node: this, types: ['msg']});
          PN.util.setupTypedText({name: 'param2', node: this, types: ['str','num','bool','json','msg']});
          PN.util.setupTypedText({name: 'param3', node: this, types: ['str','num','bool','json','msg']});

          var myFuncDef = stringFunctions[this.func];


          function handleFunc(functionDef) {
            $("#node-div-param2Row").hide();
            $("#node-div-param3Row").hide();
            functionDef.forEach(function(param) {
              console.log("param", param);
              if(param.param2) {
                $("#node-label-param2").html(' ' + param.param2);
                $("#node-div-param2Row").show();
              }
              if (param.param3) {
                $("#node-label-param3").html(' ' + param.param3);
                $("#node-div-param3Row").show();
              }
            });
          }

          handleFunc(myFuncDef);

          var funcInput = $("#node-input-func");
          funcInput.change(function (){
            console.log('funcInput changed', this.value);
            handleFunc(stringFunctions[this.value]);
          })
        },
        render: function (){
          const {NameRow, TextRow, TypeTextRow, SelectRow} = PN.components;
          const funcNames = _.keys(stringFunctions).sort();
          return (
            <div>

              <TypeTextRow name="payloadProp" label="input" icon="arrow-down"/>
              
              <SelectRow name="func" icon="gears" options={funcNames} />

              <TypeTextRow name="param2" icon="crosshairs"/>

              <TypeTextRow name="param3" icon="crosshairs"/>

              <TypeTextRow name="resultProp" label="output" icon="arrow-up"/>

              <NameRow/>


            </div>
          )
        },
        renderHelp: function () {
          return (
            <div>
              <p>Provides <i><a href="https://lodash.com/docs#camelCase" target="_new">Lodash</a></i> string
              functions that use <code>msg.payload</code> as the first parameter.</p>
              <p>Other paramters beyond the first can be input in this node's configuration.</p>
              <p>You may also attach <code>msg.param2</code> and/or <code>msg.param3</code> and/or <code>msg.func</code> to override this node's configuration.</p>
            </div>
          )
        },
        renderDescription: () => <p>Performs Lodash string functions</p>
    });

};

