var meshblu = require('meshblu');
var _ = require('lodash');
try{
  //browser need to barf on this once, because.. I dont know. Kill me.
  require('node-rsa');
}catch(exp){
  // console.log('node-rsa err', exp);
}


var when = require('when');

var getDevices = require('./lib/getDevices');
var register = require('./lib/register');
var claim = require('./lib/claim');

var RPC_TIMEOUT = 10000;

function isBroadcast(data){
  var broadcast = false;
  _.forEach(data.devices, function(device){
    if(device === '*' || device === 'all'){
      broadcast = true;
    }
  });
  return broadcast;
}

function init(PN) {

  function meshbluserverNode(n) {
    var self = this;
    PN.nodes.createNode(self,n);
    self.server = n.server || 'meshblu-socket-io.octoblu.com';

    if(!_.startsWith(self.server, 'wss://')){
      self.server = 'wss://' + self.server;
    }
    self.port = n.port || 443;
    self.uuid = n.uuid;
    self.token = n.token;

    var options = {
      server: self.server,
      port: self.port,
      uuid: self.uuid,
      token: self.token
    };
    self.conn = meshblu.createConnection(options);

    self.conn.on('ready', function(data){
      self.conn.connected = true;
      self.emit('connReady', self.conn);
    });

    self.conn.on('message', function(data, fn){
      if(data.fromUuid === self.uuid){
        //dont allow inifinite loops
        return;
      }
      self.emit('message', data, fn);
    });

    self.conn.on('error', function(err){
      console.log('error in meshblu connection', err);
      self.emit('connError', err);
      self.error(err);
    });

    self.on('close', function() {
      if (self.conn.connected) {
        console.log('close meshblu connection');
        self.conn.close(function(){});
      }
    });

    self.conn.alternateMethod = function(name, msg, fn){
      try{
        self.conn[name](msg, fn);
      }catch(exp){
        console.log('error calling alternateMethod', name, msg, exp);
      }
    }
  }
  meshbluserverNode.groupName = 'meshblu';
  PN.nodes.registerType("meshblu-server", meshbluserverNode);

  function meshbluInNode(n) {
    var self = this;
    PN.nodes.createNode(self,n);
    self.topic = n.topic;
    self.server = n.server;
    self.serverConfig = PN.nodes.getNode(self.server);
    self.directToMe = n.directToMe;
    self.uuid = n.uuid;

    self.status({fill:"yellow",shape:"dot",text:"connecting..."});

    self.serverConfig.on('connReady', function(conn){
      self.status({fill:"green",shape:"dot",text:"connected"});
      if(!self.directToMe){
        conn.subscribe({ uuid: self.uuid, types: ['broadcast'] }, function(err){
          console.log('subscribed to', self.uuid, err);
        });
      }

    });

    self.serverConfig.on('message', function(data, fn){
      if(!self.directToMe && isBroadcast(data)){
        if(self.uuid === data.fromUuid){
          self.send(data);
        }
      }else if(self.directToMe && !isBroadcast(data)){
        self.send(data);
      }
    });

    self.serverConfig.on('connError', function(err){
      self.status({fill:"red",shape:"dot",text:"error"});
    });
  }
  meshbluInNode.groupName = 'meshblu';
  PN.nodes.registerType("meshblu in",meshbluInNode);

  function meshbluOutNode(n) {
    var self = this;
    PN.nodes.createNode(self,n);
    self.server = n.server;
    self.serverConfig = PN.nodes.getNode(self.server);
    self.broadcast = n.broadcast;
    self.uuid = n.uuid;
    self.forwards = n.forwards;

    if (self.serverConfig) {
      var node = self;

      self.status({fill:"yellow",shape:"dot",text:"connecting..."});

      self.serverConfig.on('connReady', function(conn){
        self.status({fill:"green",shape:"dot",text:"connected"});
      });

      self.on("input",function(msg) {
        if(!msg.devices){
          if(self.broadcast){
            msg.devices = '*';
          }else{
            if(self.uuid){
              msg.devices = [self.uuid];
            }
          }
        }
        if(msg.devices){
          try{
            var conn = self.serverConfig.conn;
            if(self.forwards && !msg.reply){
              var responded = false;
              function handleResponse(resp){
                if(!responded){
                  responded = true;
                  msg.payload = resp;
                  node.send(msg);
                }
              }
              if(msg.alternateMethod){
                conn.alternateMethod(msg.alternateMethod, msg, handleResponse);
              }else{
                conn.message(msg, handleResponse);
              }
              setTimeout(function(){
                if(!responded){
                  responded = true;
                  msg.payload = {error: "request timeout"};
                  self.send(msg);
                }
              },msg.timeout || RPC_TIMEOUT);
            }else{
              if(msg.reply){
                if(msg.ack && msg.fromUuid){
                  msg.devices = msg.fromUuid;
                  delete msg.fromUuid;
                  msg.payload = msg.reply;
                  delete msg.reply;
                  conn.alternateMethod('_messageAck', msg);
                }else{
                  console.log('cant reply without an ack and fromUuid', msg);
                }
              }else{
                conn.message(msg);
              }

            }
          }catch(err){
            console.log('errr sending', err);
          }
        }

      });
    } else {
      self.error("missing server configuration");
    }
  }

  meshbluOutNode.groupName = 'meshblu';
  PN.nodes.registerType("meshblu out",meshbluOutNode);

  //routes

  PN.events.on("rpc_meshblu/register", register);
  PN.events.on("rpc_meshblu/getDevices", getDevices);
  PN.events.on("rpc_meshblu/claim", claim);
}

module.exports = init;
