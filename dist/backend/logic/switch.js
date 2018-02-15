'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {

    var operators = {
        'eq': function eq(a, b) {
            return a == b;
        },
        'neq': function neq(a, b) {
            return a != b;
        },
        'lt': function lt(a, b) {
            return a < b;
        },
        'lte': function lte(a, b) {
            return a <= b;
        },
        'gt': function gt(a, b) {
            return a > b;
        },
        'gte': function gte(a, b) {
            return a >= b;
        },
        'btwn': function btwn(a, b, c) {
            return a >= b && a <= c;
        },
        'cont': function cont(a, b) {
            return (a + "").indexOf(b) != -1;
        },
        'regex': function regex(a, b, c, d) {
            return (a + "").match(new RegExp(b, d ? 'i' : ''));
        },
        'true': function _true(a) {
            return a === true;
        },
        'false': function _false(a) {
            return a === false;
        },
        'null': function _null(a) {
            return typeof a == "undefined" || a === null;
        },
        'nnull': function nnull(a) {
            return typeof a != "undefined" && a !== null;
        },
        'else': function _else(a) {
            return a === true;
        }
    };

    var SwitchNode = function (_PN$Node) {
        _inherits(SwitchNode, _PN$Node);

        function SwitchNode(n) {
            _classCallCheck(this, SwitchNode);

            var _this = _possibleConstructorReturn(this, (SwitchNode.__proto__ || Object.getPrototypeOf(SwitchNode)).call(this, n));

            _this.rules = n.rules || [];
            _this.property = n.property;
            _this.propertyType = n.propertyType || "msg";
            _this.checkall = n.checkall || "true";
            _this.previousValue = null;
            var node = _this;
            for (var i = 0; i < _this.rules.length; i += 1) {
                var rule = _this.rules[i];
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

            _this.on('input', function (msg) {
                var onward = [];
                try {
                    var prop = node.getInputValue('property', msg);
                    var elseflag = true;
                    for (var i = 0; i < node.rules.length; i += 1) {
                        var rule = node.rules[i];
                        var test = prop;
                        var v1, v2;
                        if (rule.vt === 'prev') {
                            v1 = node.previousValue;
                        } else {
                            v1 = node.evaluatePropVal(rule.v, rule.vt, msg);
                        }
                        v2 = rule.v2;
                        if (rule.v2t === 'prev') {
                            v2 = node.previousValue;
                        } else if (typeof v2 !== 'undefined') {
                            v2 = node.evaluatePropVal(rule.v2, rule.v2t, msg);
                        }
                        if (rule.t == "else") {
                            test = elseflag;elseflag = true;
                        }
                        if (operators[rule.t](test, v1, v2, rule.case)) {
                            onward.push(msg);
                            elseflag = false;
                            if (node.checkall == "false") {
                                break;
                            }
                        } else {
                            onward.push(null);
                        }
                    }
                    node.previousValue = prop;
                    this.send(onward);
                } catch (err) {
                    node.warn(err);
                }
            });
            return _this;
        }

        return SwitchNode;
    }(PN.Node);

    PN.nodes.registerType("switch", SwitchNode);
};