var arrayFunctions = require('../../shared/nodes/arrays').arrayFunctions;
var util = require("util");

module.exports = function(PN) {
  "use strict";
  const _ = require("lodash");
  const DEFAULT_RESULT = 'payload';
  const DEFAULT_INPUT = 'payload';
  const DEFAULT_INPUT_TYPE = 'msg';
  const DEFAULT_OUTPUT_TYPE = 'msg';

  function parametersExpected(inputMap, funct) {
    var number = inputMap[funct].params.length + 1;
    return number;
  }

  function ArraysNode(n) {
    PN.nodes.createNode(this,n);

    var node = this;
    node.func = n.func;
    node.param2 = n.param2;
    node.param3 = n.param3;
    node.param4 = n.param4;
    node.param2Type = n.param2Type;
    node.param3Type = n.param3Type;
    node.param4Type = n.param4Type;
    node.resultProp = n.resultProp || DEFAULT_RESULT;
    node.payloadProp = n.payloadProp || DEFAULT_INPUT;
    node.payloadPropType = n.payloadPropType || DEFAULT_INPUT_TYPE;

    node.on("input", function(msg) {
      var func = node.func;
      var param2, param3, param4;
      var resultProp = node.resultProp;
      var payloadProp = node.payloadProp;
      var payloadPropType = node.payloadPropType;


      if (msg.hasOwnProperty('func')){
        func = msg.func;
      }
      if (!arrayFunctions[func]) {
        return node.error("invalid function")
      }

      var lodashFunc = _[func];
      if (lodashFunc) {
        var msgInput = PN.util.evaluateNodeProperty(payloadProp, payloadPropType, node, msg); 
        var numberOfParameters = parametersExpected(arrayFunctions, func);

        // Use any user set outside-of-node prefernces
        // Design Note: Properties attached to message should
        // take precedence over text field input
        if(msg.hasOwnProperty('param2')){
          param2 = msg.param2;
        }
        else{
          param2 = PN.util.evaluateNodeProperty(node.param2, node.param2Type, node, msg); 
        }

        if(msg.hasOwnProperty('param3')){
          param3 = msg.param3;
        }
        else{
          param3 = PN.util.evaluateNodeProperty(node.param3, node.param3Type, node, msg); 
        }

        if(msg.hasOwnProperty('param4')){
          param4 = msg.param4;
        }
        else{
          param4 = PN.util.evaluateNodeProperty(node.param4, node.param4Type, node, msg); 
        }

        console.log('msgInput', msgInput, 'param2', param2, 'param3', param3);
        if (numberOfParameters === 1) {
          _.set(msg, resultProp, lodashFunc(msgInput));
        } else if (numberOfParameters === 2) {
          _.set(msg, resultProp, lodashFunc(msgInput, param2));
        } else if (numberOfParameters === 3 ) {
          _.set(msg, resultProp, lodashFunc(msgInput, param2, param3));
        } else {
          _.set(msg, resultProp, lodashFunc(msgInput, param2, param3, param4));
        }
        node.send(msg);
      }

    });
  }
  PN.nodes.registerType("arrays", ArraysNode);
};

