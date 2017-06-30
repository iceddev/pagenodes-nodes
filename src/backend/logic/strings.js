const {stringFunctions, addCustomFunctions} = require('../../shared/nodes/strings');
const _ = require('lodash');
addCustomFunctions(_);

module.exports = function(PN) {
  "use strict";
  const DEFAULT_RESULT = 'payload';
  const DEFAULT_INPUT = 'payload';
  const DEFAULT_INPUT_TYPE = 'msg';

  function StringsNode(n) {
    PN.nodes.createNode(this,n);

    var node = this;
    node.func = n.func;
    node.param2 = n.param2;
    node.param3 = n.param3;
    node.param2Type = n.param2Type;
    node.param3Type = n.param3Type;
    node.resultProp = n.resultProp || DEFAULT_RESULT;
    node.resultPropType = n.resultPropType || DEFAULT_INPUT_TYPE;
    node.payloadProp = n.payloadProp || DEFAULT_INPUT;
    node.payloadPropType = n.payloadPropType || DEFAULT_INPUT_TYPE;

    this.on("input", function(msg) {
      var func = node.func;
      var param2, param3;
      var resultProp = node.resultProp;

      var msgInput = PN.util.evaluateNodeProperty(node.payloadProp, node.payloadPropType, node, msg);

      // Use any user set outside-of-node prefernces
      // Design Note: Properties attached to message should
      // take precedence over text field input
      if(msg.hasOwnProperty('param2')){
        param2 = msg.param2;
      }
      else if(node.param2){
        param2 = PN.util.evaluateNodeProperty(node.param2, node.param2Type, node, msg);
      }

      if(msg.hasOwnProperty('param3')){
        param3 = msg.param3;
      }
      else if(node.param3){
        param3 = PN.util.evaluateNodeProperty(node.param3, node.param3Type, node, msg);
      }



      if (msg.hasOwnProperty('func')){
        func = msg.func;
      }

      if (!stringFunctions[func]) {
        return node.error("invalid function")
      }
      var lodashFunc = _[func];
      if(lodashFunc){
        console.log('msgInput', msgInput, 'param2', param2, 'param3', param3);
        node.setResult(msg, lodashFunc(msgInput, param2, param3));
        node.send(msg);
      }

    });
  }
  PN.nodes.registerType("strings", StringsNode);
};
