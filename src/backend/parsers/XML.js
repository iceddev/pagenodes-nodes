
module.exports = function(PN) {
    const xml2js = require('xml2js');
    const parseString = xml2js.parseString;
    const builder = new xml2js.Builder({renderOpts:{pretty:false}});

    class XMLNode extends PN.Node {
      constructor(n) {
          super(n);
          this.attrkey = n.attr;
          this.charkey = n.chr;
          var node = this;
          this.on("input", function(msg) {
            const value = node.getPayloadValue(msg);
            if (value) {
                  if (typeof value === "object") {
                      var options = {};
                      if (msg.hasOwnProperty("options") && typeof msg.options === "object") { options = msg.options; }
                      options.async = false;
                      node.setResult(msg, builder.buildObject(msg[node.propName], options));
                      node.send(msg);
                  }
                  else if (typeof value === "string") {
                      var options = {};
                      if (msg.hasOwnProperty("options") && typeof msg.options === "object") { options = msg.options; }
                      options.async = true;
                      options.attrkey = node.attrkey || options.attrkey || '$';
                      options.charkey = node.charkey || options.charkey || '_';
                      parseString(msg[node.propName], options, function (err, result) {
                          if (err) { node.error(err, msg); }
                          else {
                              node.setResult(msg, resutl);
                              node.send(msg);
                          }
                      });
                  }
                  else { node.warn(PN._("xml.errors.xml_js")); }
              }
              else { node.send(msg); } // If no payload - just pass it on.
          });
      }
    }
    PN.nodes.registerType("xml",XMLNode);
};
