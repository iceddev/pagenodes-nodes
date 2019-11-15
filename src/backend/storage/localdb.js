const STORAGE_PREFIX = 'LDB_';

module.exports = function(PN) {

  const localforage = require('localforage');
  const _ = PN.util;

  class LocalWriteNode extends PN.Node {
    constructor(n) {
      super(n);
      var node = this;
      node.key = n.key;
      node.append = n.append

      this.on("input", function(msg) {
        if (msg.hasOwnProperty("payload")) {
          if(n.append){
            localforage.getItem(STORAGE_PREFIX + node.key).then(function(value){
              if(value){
                console.log('initial value:',value);
                if(Array.isArray(value)){
                  value.push(msg.payload);
                }else{
                  value = [value];
                  value.push(msg.payload);
                }
              }
              console.log('pushed value:',value);
              localforage.setItem(STORAGE_PREFIX + node.key, value);
            });
          }
          else {
            console.log('INITIAL DATA');
            localforage.setItem(STORAGE_PREFIX + node.key, msg.payload, function(err, value){
              console.log('Initial value:',value,' with the key:',node.key);
            });
          }
        }
        else {
          node.send(msg);
          console.log(msg);
        } // If no payload - just pass it on.
      });
    }
  }
  LocalWriteNode.groupName = 'localdb';
  PN.nodes.registerType("localwrite",LocalWriteNode);

  class LocalReadNode extends PN.Node {
    constructor(n){
      super(n);
      var node = this;
      node.key = n.key;

      this.on("input", function(msg){
        if(msg.hasOwnProperty("payload")){
          localforage.getItem(STORAGE_PREFIX + node.key, function(err,value){
            msg.payload = value;
            node.send(msg);
          });
        }
      });
    }
  }
  LocalReadNode.groupName = 'localdb';
  PN.nodes.registerType('localread',LocalReadNode);
};
