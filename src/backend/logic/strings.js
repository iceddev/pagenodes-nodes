const {stringFunctions, addCustomFunctions} = require('../../shared/nodes/strings');

module.exports = function(PN) {

  const _ = PN.util;
  addCustomFunctions(_);

  class StringsNode extends PN.Node {
    constructor(n) {
      super(n);

      var node = this;
      node.func = n.func;
      node.param2 = n.param2;
      node.param3 = n.param3;
      node.param2Type = n.param2Type;
      node.param3Type = n.param3Type;

      this.on("input", function(msg) {
        var func = node.func;
        var param2, param3;
        var resultProp = node.resultProp;

        var msgInput = node.getPayloadValue(msg);

        // Use any user set outside-of-node prefernces
        // Design Note: Properties attached to message should
        // take precedence over text field input
        if(msg.hasOwnProperty('param2')){
          param2 = msg.param2;
        }
        else if(node.param2){
          param2 = node.getInputValue('param2', msg);
        }

        if(msg.hasOwnProperty('param3')){
          param3 = msg.param3;
        }
        else if(node.param3){
          param3 = node.getInputValue('param3', msg);
        }



        if (msg.hasOwnProperty('func')){
          func = msg.func;
        }

        if (!stringFunctions[func]) {
          return node.error("invalid function")
        }
        var lodashFunc = _[func];
        if(lodashFunc){
          // console.log('msgInput', msgInput, 'param2', param2, 'param3', param3);
          node.setResult(msg, lodashFunc(msgInput, param2, param3));
          node.send(msg);
        }

      });
    }
  }
  PN.nodes.registerType("strings", StringsNode);
};
