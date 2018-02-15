module.exports = function(PN) {
  class BufferNode extends PN.Node {
    constructor(n) {
      super(n);
      var node = this;
      node.encoding = n.encoding;

      this.on("input", function(msg) {
        const inputVal = node.getPayloadValue(msg);
        if (inputVal) {
          var encoder = node.encoding;
          // Use user set encoding property on message if available
          if(msg.hasOwnProperty("encoding")){
            encoder = msg.encoding;
          }

          if(Buffer.isBuffer(inputVal)) {
            node.setResult(msg, new Buffer(inputVal).toString(encoder));
          }
          else if (Array.isArray(inputVal)) {
            node.setResult(msg, new Buffer(inputVal));
          }
          else {
            // The string must be turned into a Buffer
            // with default or specified encoding
            let data = String(inputVal);
            if(encoder === 'dataUrl') {
              try{
                data = data.split(';')[1].split(',')[1];
                encoder = 'base64';
              }catch(exp){
                console.log('error parsing dataUrl', exp);
              }
            }
            node.setResult(msg, new Buffer(data, encoder));
          }
        }
        node.send(msg);
      });
    }
  }
  PN.nodes.registerType("buffer", BufferNode);
}
