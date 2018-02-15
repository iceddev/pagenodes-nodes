module.exports = function(PN){

  PN.nodes.registerType('buffer',{
    category: 'function',      // the palette category
    color:"#DEBD5C", //light red
    defaults: {             // defines the editable properties of the node
      name: {value:""},   //  along with default values.
      payload: {value:"payload", required:false},
      result: {value:"payload", required:false},
      payloadType: {value:"msg", required:false},
      resultType: {value:"msg", required:false},
      encoding: {value:"utf8", required:true},
    },
    inputs:1,   // set the number of inputs - only 0 or 1
    outputs:1,  // set the number of outputs - 0 to n
    faChar: "&#223;",  //Sharp S from German
    label: function() {  // sets the default label contents
      return 'buffer';
    },
    oneditprepare: function() {
      PN.util.setupTypedPayload(this,['msg','flow']);
      PN.util.setupTypedResult(this);
    },
    render: function (){
      const {NameRow, SelectRow, PayloadRow, ResultRow} = PN.components;
      return (
        <div>

          <PayloadRow/>

          <SelectRow name="encoding" icon="tasks" options={['ascii', 'utf8', 'utf16le', 'base64', 'hex', 'dataUrl']} />

          <ResultRow/>

          <NameRow/>
          
        </div>
      )
    },
    renderHelp: function () {
      return (
        <div>
          <p>A function that parses the <code>msg.payload</code> to/from a Buffer,
            and places the result back into the payload.</p>
          <p>If the input is a Buffer object, the node parses the object into a String with
            encoding chosen from the configuration in the node, or specified in <code>msg.encoding</code>.</p>
          <p>If the input is a String, the node parses the String into a Buffer object with
            encoding chosen from the configuration in the node, or specified in <code>msg.encoding</code>.</p>
          <p>If the input is an Array, the node parses the Array into a Binary Buffer object.</p>
        </div>
      )
    },
    renderDescription: () => <p>Parses <code>msg.payload</code> to/from a Buffer</p>
  });


};
