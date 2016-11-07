module.exports = function(PN) {
    "use strict";
    var operators = {
        'eq': function(a, b) { return a == b; },
        'neq': function(a, b) { return a != b; },
        'lt': function(a, b) { return a < b; },
        'lte': function(a, b) { return a <= b; },
        'gt': function(a, b) { return a > b; },
        'gte': function(a, b) { return a >= b; },
        'btwn': function(a, b, c) { return a >= b && a <= c; },
        'cont': function(a, b) { return (a + "").indexOf(b) != -1; },
        'regex': function(a, b, c, d) { return (a + "").match(new RegExp(b,d?'i':'')); },
        'true': function(a) { return a === true; },
        'false': function(a) { return a === false; },
        'null': function(a) { return (typeof a == "undefined" || a === null); },
        'nnull': function(a) { return (typeof a != "undefined" && a !== null); },
        'else': function(a) { return a === true; }
    };

    function SwitchNode(n) {
        PN.nodes.createNode(this, n);
        this.rules = n.rules || [];
        this.property = n.property;
        this.propertyType = n.propertyType || "msg";
        this.checkall = n.checkall || "true";
        this.previousValue = null;
        var node = this;
        for (var i=0; i<this.rules.length; i+=1) {
            var rule = this.rules[i];
            if (!rule.vt) {
                if (!isNaN(Number(rule.v))) {
                    rule.vt = 'num';
                } else {
                    rule.vt = 'str';
                }
            }
            if (rule.vt === 'num') {
                if (!isNaN(Number(rule.v))) {
                    rule.v = Number(rule.v);
                }
            }
            if (typeof rule.v2 !== 'undefined') {
                if (!rule.v2t) {
                    if (!isNaN(Number(rule.v2))) {
                        rule.v2t = 'num';
                    } else {
                        rule.v2t = 'str';
                    }
                }
                if (rule.v2t === 'num') {
                    rule.v2 = Number(rule.v2);
                }
            }
        }

        this.on('input', function (msg) {
            var onward = [];
            try {
                var prop = PN.util.evaluateNodeProperty(node.property,node.propertyType,node,msg);
                var elseflag = true;
                for (var i=0; i<node.rules.length; i+=1) {
                    var rule = node.rules[i];
                    var test = prop;
                    var v1,v2;
                    if (rule.vt === 'prev') {
                        v1 = node.previousValue;
                    } else {
                        v1 = PN.util.evaluateNodeProperty(rule.v,rule.vt,node,msg);
                    }
                    v2 = rule.v2;
                    if (rule.v2t === 'prev') {
                        v2 = node.previousValue;
                    } else if (typeof v2 !== 'undefined') {
                        v2 = PN.util.evaluateNodeProperty(rule.v2,rule.v2t,node,msg);
                    }
                    if (rule.t == "else") { test = elseflag; elseflag = true; }
                    if (operators[rule.t](test,v1,v2,rule.case)) {
                        onward.push(msg);
                        elseflag = false;
                        if (node.checkall == "false") { break; }
                    } else {
                        onward.push(null);
                    }
                }
                node.previousValue = prop;
                this.send(onward);
            } catch(err) {
                node.warn(err);
            }
        });
    }
    PN.nodes.registerType("switch", SwitchNode);
};
