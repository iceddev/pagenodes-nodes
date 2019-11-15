const collectionFunctions = require('../../shared/nodes/collections').collectionFunctions;

module.exports = function(PN) {
  const _ = PN.util;

  function parametersExpected(inputMap, funct) {
    var number = inputMap[funct].params.length + 1;
    return number;
  }

  class CollectionsNode extends PN.Node {
    constructor(n) {
      super(n);
      var node = this;
      node.func = n.func;
      node.param2 = n.param2;
      node.param3 = n.param3;
      node.param4 = n.param4;
      node.param2Type = n.param2Type;
      node.param3Type = n.param3Type;
      node.param4Type = n.param4Type;

      node.on("input", function(msg) {
        var func = node.func;
        var param2, param3, param4;
        var resultProp = node.resultProp;
        var payloadProp = node.payloadProp;
        var payloadPropType = node.payloadPropType;

        if (msg.hasOwnProperty('func')){
          func = msg.func;
        }
        if (!collectionFunctions[func]) {
          return node.error("invalid function")
        }

        var lodashFunc = _[func];
        if (lodashFunc) {
          var msgInput = node.getPayloadValue(msg);
          var numberOfParameters = parametersExpected(collectionFunctions, func);

          // Use any user set outside-of-node prefernces
          // Design Note: Properties attached to message should
          // take precedence over text field input
          if(msg.hasOwnProperty('param2')){
            param2 = msg.param2;
          }
          else{
            param2 = node.getInputValue('param2', msg);
          }

          if(msg.hasOwnProperty('param3')){
            param3 = msg.param3;
          }
          else{
            param3 = node.getInputValue('param3', msg);
          }

          if(msg.hasOwnProperty('param4')){
            param4 = msg.param4;
          }
          else{
            param4 = node.getInputValue('param4', msg);
          }

          // console.log('msgInput', msgInput, 'param2', param2, 'param3', param3);
          if (numberOfParameters === 1) {
            node.setResult(msg, lodashFunc(msgInput));
          } else if (numberOfParameters === 2) {
            node.setResult(msg, lodashFunc(msgInput, param2));
          } else if (numberOfParameters === 3 ) {
            node.setResult(msg, lodashFunc(msgInput, param2, param3));
          } else {
            node.setResult(msg, lodashFunc(msgInput, param2, param3, param4));
          }
          node.send(msg);
        }

      });
    }
  }
  PN.nodes.registerType("collections", CollectionsNode);
};
