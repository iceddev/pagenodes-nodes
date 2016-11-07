
module.exports = function(PN) {
    "use strict";
    var xml2js = require('xml2js');
    var parseString = xml2js.parseString;
    var builder = new xml2js.Builder({renderOpts:{pretty:false}});

    function XMLNode(n) {
        PN.nodes.createNode(this,n);
        this.attrkey = n.attr;
        this.charkey = n.chr;
        var node = this;
        node.propName = n.propName || "payload";
        this.on("input", function(msg) {
          if (msg.hasOwnProperty(node.propName)) {
                if (typeof msg[node.propName] === "object") {
                    var options = {};
                    if (msg.hasOwnProperty("options") && typeof msg.options === "object") { options = msg.options; }
                    options.async = false;
                    msg[node.propName] = builder.buildObject(msg[node.propName], options);
                    node.send(msg);
                }
                else if (typeof msg[node.propName] === "string") {
                    var options = {};
                    if (msg.hasOwnProperty("options") && typeof msg.options === "object") { options = msg.options; }
                    options.async = true;
                    options.attrkey = node.attrkey || options.attrkey || '$';
                    options.charkey = node.charkey || options.charkey || '_';
                    parseString(msg[node.propName], options, function (err, result) {
                        if (err) { node.error(err, msg); }
                        else {
                            msg[node.propName] = result;
                            node.send(msg);
                        }
                    });
                }
                else { node.warn(PN._("xml.errors.xml_js")); }
            }
            else { node.send(msg); } // If no payload - just pass it on.
        });
    }
    PN.nodes.registerType("xml",XMLNode);
};
