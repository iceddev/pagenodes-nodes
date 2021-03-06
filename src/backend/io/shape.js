
const WW_SCRIPT = './shape-worker.bundle.js';

let worker;

function getImageData(imgUrl, callback) {
  var img = new Image();
  img.onload = function() {
    var canvas = document.createElement('canvas');
    canvas.height = img.naturalHeight;
    canvas.width = img.naturalWidth;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    callback(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };
  img.src = imgUrl;
}

module.exports = function(PN) {

  class ShapeDetectorNode extends PN.Node {
    constructor(n) {
      super(n);

      if(!worker) {
        worker = new Worker(WW_SCRIPT);
        worker.onmessage = function(evt){
          var data = evt.data;
          PN.events.emit('shape_' + data.nodeId, data);
        };
      }

      var node = this;
      node.shapeType = n.shapeType;
      node.msgs = {};

      function handleResults(data) {
        try{
          if(data.error){
            node.error(data.error);
          }
          else {
            node.msgs[data._msgid].results = data.results;
            node.send(node.msgs[data._msgid]);
          }
          delete node.msgs[data._msgid];
        }catch(exp){
          node.error(exp);
        }
      }

      PN.events.on('shape_' + node.id, handleResults);

      node.on('close', function() {
        PN.events.removeListener('shape_' + node.id, handleResults);
      });

      try {
        node.on("input", function(msg) {
          try {
            if(!msg.image) {
              return node.send(msg);
            }
            const _msgid = msg._msgid = msg._msgid || PN.util.generateId();
            node.msgs[msg._msgid] = msg;
            var nodeId = node.id;
            if(typeof msg.image === 'string') {
              getImageData(msg.image, function(imageData){
                worker.postMessage({nodeId, _msgid, imageData, shapeType: msg.shapeType || node.shapeType});
              });
            } else if(typeof msg.image === 'object') {
              worker.postMessage({nodeId, _msgid, imageData: msg.image, shapeType: msg.shapeType || node.shapeType});
            }

          } catch(err) {
            node.error(err);
          }
        });
      } catch(err) {
        node.error(err);
      }
    }
  }
  PN.nodes.registerType("shape",ShapeDetectorNode);
};
