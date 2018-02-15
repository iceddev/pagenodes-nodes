module.exports = function(PN){
  PN.nodes.registerType('xml',{
    category: 'function',
    color:"#DEBD5C",
    defaults: {
      name: {value:""},
      payload: {value:"payload", required:false},
      result: {value:"payload", required:false},
      payloadType: {value:"msg", required:false},
      resultType: {value:"msg", required:false}
    },
    inputs:1,
    outputs:1,
    faChar: "&#xf1c9;",
    label: function() {
      return this.name||"xml";
    },
    oneditprepare: function() {
      PN.util.setupTypedPayload(this, ['msg','flow']);
      PN.util.setupTypedResult(this);
    },
    render: function () {
      const {NameRow, PayloadRow, ResultRow} = PN.components;
      return (
        <div>
          <PayloadRow/>
          <ResultRow/>
          <NameRow/>
        </div>
      )
    },
    renderHelp: function () {
      return (
        <div>
          <p>A function that parses the <code>msg.payload</code> or another property to/from XML,
            and places the result back into that property.</p>
          <p>If the input is an object, the node converts that object into a XML String.</p>
          <p>If the input is a XML String, the node parses the XML String into an object.</p>
        </div>
      )
    },
    renderDescription: () => <p>Parses/Stringifies XML</p>


  });
};
