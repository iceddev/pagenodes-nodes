
global.Buffer = Buffer;

function init(PN) {

  class SerialInNode extends PN.Node {
    constructor(n) {
      super(n);
      var node = this;
      node.connection = n.connection;
      node.connectionConfig = PN.nodes.getNode(node.connection);

      if(node.connectionConfig){
        node.status({fill:"yellow",shape:"dot",text:"connecting..."});

        node.connectionConfig.on('connReady', function(conn){
          node.status({fill:"green",shape:"dot",text:"connected"});
        });

        node.connectionConfig.on('data', function(data){
          node.send({
            topic: 'serial',
            payload: data
          })
        });

        node.connectionConfig.on('connError', function(err){
          node.status({fill:"red",shape:"dot",text:"error"});
        });
      }

    }
  }
  SerialInNode.groupName = 'serial';
  PN.nodes.registerType("serial in",SerialInNode);

  class SerialOutNode extends PN.Node {
    constructor(n) {
      super(n);
      var node = this;
      node.connection = n.connection;
      node.connectionConfig = PN.nodes.getNode(node.connection);

      if (node.connectionConfig) {

        node.status({fill:"yellow",shape:"dot",text:"connecting..."});

        node.connectionConfig.on('connReady', function(conn){
          node.status({fill:"green",shape:"dot",text:"connected"});
        });

        node.on('input',function(msg) {
          if(node.connectionConfig.sp){
            if (!Buffer.isBuffer(msg.payload)) {
              msg.payload = new Buffer(msg.payload);
            }
            node.connectionConfig.sp.write(msg.payload, function(err, ok){
              if(err){
                node.error(err);
              }
            });
          }
        });

        node.connectionConfig.on('connError', function(err){
          node.status({fill:"red",shape:"dot",text:"error"});
        });

      } else {
        node.error("missing connection configuration");
      }
    }
  }
  SerialOutNode.groupName = 'serial';
  PN.nodes.registerType("serial out",SerialOutNode);

}

module.exports = init;
