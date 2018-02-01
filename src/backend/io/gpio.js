const rest = require('rest');
const mimeInterceptor = require('rest/interceptor/mime');
const errorCodeInterceptor = require('rest/interceptor/errorCode');
const restCall = rest.wrap(mimeInterceptor).wrap(errorCodeInterceptor);

function connectingStatus(n){
  n.status({fill:"yellow",shape:"ring",text:"initializing..."});
}

function j5WorkerStatus(n){
  n.status({fill:"yellow",shape:"dot",text:"j5 worker init..."});
}

function networkReadyStatus(n){
  n.status({fill:"yellow",shape:"ring",text:"connecting..."});
}

function networkErrorStatus(n){
  n.status({fill:"red",shape:"dot",text:"disconnected"});
}

function ioErrorStatus(n, err){
  var errText = err.message || "error";
  n.status({fill:"red",shape:"dot",text: errText});
}

function connectedStatus(n, text){
  n.status({fill:"green",shape:"dot",text: text || "connected"});
}


function setupStatus(node){
  // console.log('setupStatus', node);
  process.nextTick(function(){
    connectingStatus(node);
  });
  node.nodebot.on('networkReady', function(){
    networkReadyStatus(node);
  });
  node.nodebot.on('workerReady', function(){
    networkReadyStatus(node);
  });
  node.nodebot.on('networkError', function(){
    networkErrorStatus(node);
  });
  node.nodebot.on('ioError', function(err){
    ioErrorStatus(node, err);
  });
}

function init(PN) {

  class GpioInNode extends PN.Node {
    constructor(n) {
      super(n);
      this.buttonState = -1;
      this.pin = n.pin;
      this.state = n.state;
      this.nodebot = PN.nodes.getNode(n.board);
      if (typeof this.nodebot === "object") {

        var node = this;
        setupStatus(node);

        node.nodebot.on('boardReady', function() {
          var io = node.nodebot.io;
          connectedStatus(node);
          var samplingInterval = parseInt(samplingInterval, 10) || 300;
          node.nodebot.worker.postMessage({type: 'inputSubscribe', state: node.state, pin: node.pin, nodeId: node.id, samplingInterval});
          node.nodebot.on('inputSubscription_' + node.id, function(value){
            var msg = {payload:value, topic:node.pin};
            node.send(msg);
          });

        });

      }
      else {
        this.warn("nodebot not configured");
      }
    }
  }
  GpioInNode.groupName = 'gpio';
  PN.nodes.registerType("gpio in",GpioInNode);

  class GpioOutNode extends PN.Node {
    constructor(n) {
      super(n);
      this.buttonState = -1;
      this.pin = n.pin;
      this.state = n.state;
      this.arduino = n.arduino;
      this.nodebot = PN.nodes.getNode(n.board);
      if (typeof this.nodebot === "object") {
        var node = this;
        setupStatus(node);

        // console.log('launching gpio out', n);
        node.nodebot.on('boardReady', function() {
          connectedStatus(node);
          node.on('input', function(msg) {
            var state = msg.state || node.state;
            var pin = msg.pin || node.pin;
            node.nodebot.worker.postMessage({type: 'output', state, pin, nodeId: node.id, msg});

          });
        });
      }
      else {
        this.warn("nodebot not configured");
      }

    }
  }
  GpioOutNode.groupName = 'gpio';
  PN.nodes.registerType("gpio out",GpioOutNode);

  class NodePixelNode extends PN.Node {
    constructor(n) {
      super(n);
      this.buttonState = -1;
      this.pin = parseInt(n.pin, 10);
      this.length = parseInt(n.length, 10);
      this.controller = n.controller;

      this.nodebot = PN.nodes.getNode(n.board);
      if (typeof this.nodebot === "object") {
        var node = this;
        setupStatus(node);

        // console.log('launching nodepixel', n);
        node.nodebot.on('boardReady', function() {

          connectedStatus(node);
          var pixelConfig = {
            pin: node.pin,
            length: node.length,
            controller: node.controller
          };

          node.nodebot.worker.postMessage({type: 'setupPixel', config: pixelConfig, nodeId: node.id});

          node.on('input', function(msg) {
            node.nodebot.worker.postMessage({type: 'pixelMsg', nodeId: node.id, msg});
          });

        });
      }
      else {
        this.warn("nodebot not configured");
      }

    }
  }
  NodePixelNode.groupName = 'gpio';
  PN.nodes.registerType("pixel",NodePixelNode);

  class ServoNode extends PN.Node {
    constructor(n) {
      super(n);
      this.buttonState = -1;
      this.pin = parseInt(n.pin, 10);
      this.controller = n.controller;
      this.mode = n.mode;
      this.upperRange = n.upperRange;
      this.lowerRange = n.lowerRange;

      this.nodebot = PN.nodes.getNode(n.board);
      if (typeof this.nodebot === "object") {
        var node = this;
        setupStatus(node);

        node.nodebot.on('boardReady', function() {

          connectedStatus(node);
          var servoConfig = {
            pin: node.pin,
            mode: node.mode,
            controller: node.controller,
            lowerRange: node.lowerRange,
            upperRange: node.upperRange
          };

          node.nodebot.worker.postMessage({type: 'setupServo', config: servoConfig, nodeId: node.id});

          node.on('input', function(msg) {
            node.nodebot.worker.postMessage({type: 'servoMsg', nodeId: node.id, msg});
          });

        });

      }
      else {
        this.warn("nodebot not configured");
      }

    }
  }
  ServoNode.groupName = 'gpio';
  PN.nodes.registerType("servo",ServoNode);

  class NodeLedNode extends PN.Node {
    constructor(n) {
      super(n);
      this.address = parseInt(n.address, 10);
      this.mode = n.mode;

      this.nodebot = PN.nodes.getNode(n.board);
      if (typeof this.nodebot === "object") {
        var node = this;
        setupStatus(node);

        node.nodebot.on('boardReady', function() {

          connectedStatus(node);
          var ledConfig = {
            address: node.address,
            mode: node.mode
          };

          node.nodebot.worker.postMessage({type: 'setupNodeLed', config: ledConfig, nodeId: node.id});

          node.on('input', function(msg) {
            node.nodebot.worker.postMessage({type: 'nodeLedMsg', nodeId: node.id, msg});
          });

        });

      }
      else {
        this.warn("nodebot not configured");
      }

    }
  }
  NodeLedNode.groupName = 'gpio';
  PN.nodes.registerType("node-led",NodeLedNode);

  class Johnny5Node extends PN.Node {
    constructor(n) {
      super(n);
      this.nodebot = PN.nodes.getNode(n.board);
      this.func = n.func;
      var node = this;


      if (typeof this.nodebot === "object") {
        setupStatus(node);
        node.nodebot.on('boardReady', function() {
          connectedStatus(node);
          //console.log('launching Johnny5Node boardReady', n);
          node.nodebot.worker.postMessage({type: 'run', data: node.func, nodeId: node.id});
        });

        node.nodebot.on('send_' + node.id, function(msg){
          node.send(msg);
        });

        node.on('input', function(msg){
          node.nodebot.worker.postMessage({type: 'input', msg, nodeId: node.id});
        });


      }
      else {
        node.warn("nodebot not configured");
      }

    }
  }
  Johnny5Node.groupName = 'gpio';
  PN.nodes.registerType("johnny5",Johnny5Node);

  PN.events.on('rpc_gpio/getExamples', function(msg){
    restCall({
      path: 'https://api.github.com/gists/f6f272f8998fd98e59ff131359ccf5ac'
    })
      .then(function(result){
        msg.reply({entity: result.entity});
      })
      .catch(function(err){
        msg.reply({error: err});
      });
  });


}

module.exports = init;
