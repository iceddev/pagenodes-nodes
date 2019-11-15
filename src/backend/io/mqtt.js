const mqtt = require('mqtt');
const isUtf8 = require('is-utf8');

function init(PN) {

  const _ = PN.util;

  class MQTTBrokerNode extends PN.Node {
    constructor(n) {
      super(n)
      var self = this;
      self.server = n.server;

      self.username = n.username;
      self.password = n.password;
      self.clientId = n.clientId;

      var options = {
        username: self.username,
        password: self.password,
        clientId: self.clientId
      };

      try{
        self.conn = mqtt.connect(self.server, options);

        self.conn.on('connect', function () {
          process.nextTick(function(){
            self.emit('connReady', self.conn);
          });
        });

        self.conn.on('message', function(topic, payload){
          // console.log('mqtt message received', topic, payload);
          if (isUtf8(payload)) {
            payload = payload.toString();
          }
          self.emit('message_' + topic, payload);
        });

        self.conn.on('error', function(err){
           console.log('error in mqtt connection', err);
           self.emit('connError', err);
           self.error(err);
        });
      }catch(exp){
        console.log('error creating mqtt connection', exp);
        setTimeout(function(){
          self.emit('connError', {});
        }, 100)
        self.error(exp);
      }

      self.on('close', function() {
        self.conn.end();
      });

    }
  }
  MQTTBrokerNode.groupName = 'mqtt';
  PN.nodes.registerType("mqtt-broker", MQTTBrokerNode);

  class MQTTInNode extends PN.Node {
    constructor(n) {
      super(n)
      var self = this;
      self.topic = n.topic;
      self.broker = n.broker;
      self.brokerConfig = PN.nodes.getNode(self.broker);

      if(self.brokerConfig){
        self.status({fill:"yellow",shape:"dot",text:"connecting..."});

        self.brokerConfig.on('connReady', function(conn){
          self.status({fill:"green",shape:"dot",text:"connected"});
          self.brokerConfig.conn.subscribe(self.topic);
        });

        self.brokerConfig.on('message_' + self.topic, function(payload){
          self.send({
            topic: self.topic,
            payload: payload
          })
        });

        self.brokerConfig.on('connError', function(err){
          self.status({fill:"red",shape:"dot",text:"error"});
        });
      }

    }
  }
  MQTTInNode.groupName = 'mqtt';
  PN.nodes.registerType("mqtt in",MQTTInNode);

  class MQTTOutNode extends PN.Node {
    constructor(n) {
      super(n)
      var self = this;
      self.broker = n.broker;
      self.brokerConfig = PN.nodes.getNode(self.broker);
      self.topic = n.topic;

      if (self.brokerConfig) {

        self.status({fill:"yellow",shape:"dot",text:"connecting..."});

        self.brokerConfig.on('connReady', function(conn){
          self.status({fill:"green",shape:"dot",text:"connected"});
        });

        self.on('input',function(msg) {
          if(self.brokerConfig.conn){
            var topic = msg.topic || self.topic;
            if(topic){
              if (!Buffer.isBuffer(msg.payload)) {
                if (typeof msg.payload === 'object') {
                  msg.payload = JSON.stringify(msg.payload);
                } else if (typeof msg.payload !== 'string') {
                  msg.payload = '' + msg.payload;
                }
              }

              var options = {
                  qos: msg.qos || 0,
                  retain: msg.retain || false
              };

              self.brokerConfig.conn.publish(topic, msg.payload, options);
            }
            else{
              self.error("must publish on a topic");
            }
          }
        });

        self.brokerConfig.on('connError', function(err){
          self.status({fill:"red",shape:"dot",text:"error"});
        });

      } else {
        self.error("missing broker configuration");
      }
    }
  }
  MQTTOutNode.groupName = 'mqtt';
  PN.nodes.registerType("mqtt out",MQTTOutNode);

}

module.exports = init;
