module.exports = function(PN) {
  "use strict";

  function ChangeNode(n) {
      PN.nodes.createNode(this, n);

      this.rules = n.rules;
      if (!this.rules) {
          var rule = {
              t:(n.action=="replace"?"set":n.action),
              p:n.property||""
          }

          if ((rule.t === "set")||(rule.t === "move")) {
              rule.to = n.to||"";
          } else if (rule.t === "change") {
              rule.from = n.from||"";
              rule.to = n.to||"";
              rule.re = (n.reg===null||n.reg);
          }
          this.rules = [rule];
      }

      var valid = true;
      for (var i=0;i<this.rules.length;i++) {
          var rule = this.rules[i];
          // Migrate to type-aware rules
          if (!rule.pt) {
              rule.pt = "msg";
          }
          if (rule.t === "change" && rule.re) {
              rule.fromt = 're';
              delete rule.re;
          }
          if (rule.t === "set" && !rule.tot) {
              if (rule.to.indexOf("msg.") === 0 && !rule.tot) {
                  rule.to = rule.to.substring(4);
                  rule.tot = "msg";
              }
          }
          if (!rule.tot) {
              rule.tot = "str";
          }
          if (!rule.fromt) {
              rule.fromt = "str";
          }
          if (rule.t === "change" && rule.fromt !== 'msg' && rule.fromt !== 'flow' && rule.fromt !== 'global') {
              rule.fromRE = rule.from;
              if (rule.fromt !== 're') {
                  rule.fromRE = rule.fromRE.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
              }
              try {
                  rule.fromRE = new RegExp(rule.fromRE, "g");
              } catch (e) {
                  valid = false;
                  this.error(PN._("change.errors.invalid-from",{error:e.message}));
              }
          }
          if (rule.tot === 'num') {
              rule.to = Number(rule.to);
          } else if (rule.tot === 'json') {
              try {
                  rule.to = JSON.parse(rule.to);
              } catch(e2) {
                  valid = false;
                  this.error(PN._("change.errors.invalid-json"));
              }
          } else if (rule.tot === 'bool') {
              rule.to = /^true$/i.test(rule.to);
          }
      }

      function applyRule(msg,rule) {
          try {
              var property = rule.p;
              var value = rule.to;
              var current;
              var fromValue;
              var fromType;
              var fromRE;
              if (rule.tot === "msg") {
                  value = PN.util.getMessageProperty(msg,rule.to);
              } else if (rule.tot === 'flow') {
                  value = node.context().flow.get(rule.to);
              } else if (rule.tot === 'global') {
                  value = node.context().global.get(rule.to);
              } else if (rule.tot === 'date') {
                  value = Date.now();
              }
              if (rule.t === 'change') {
                  if (rule.fromt === 'msg' || rule.fromt === 'flow' || rule.fromt === 'global') {
                      if (rule.fromt === "msg") {
                          fromValue = PN.util.getMessageProperty(msg,rule.from);
                      } else if (rule.tot === 'flow') {
                          fromValue = node.context().flow.get(rule.from);
                      } else if (rule.tot === 'global') {
                          fromValue = node.context().global.get(rule.from);
                      }
                      if (typeof fromValue === 'number' || fromValue instanceof Number) {
                          fromType = 'num';
                      } else if (typeof fromValue === 'boolean') {
                          fromType = 'bool'
                      } else if (fromValue instanceof RegExp) {
                          fromType = 're';
                          fromRE = fromValue;
                      } else if (typeof fromValue === 'string') {
                          fromType = 'str';
                          fromRE = fromValue.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
                          try {
                              fromRE = new RegExp(fromRE, "g");
                          } catch (e) {
                              valid = false;
                              node.error(PN._("change.errors.invalid-from",{error:e.message}));
                              return;
                          }
                      } else {
                          node.error(PN._("change.errors.invalid-from",{error:"unsupported type: "+(typeof fromValue)}));
                          return
                      }
                  } else {
                      fromType = rule.fromt;
                      fromValue = rule.from;
                      fromRE = rule.fromRE;
                  }
              }
              if (rule.pt === 'msg') {
                  if (rule.t === 'delete') {
                      PN.util.setMessageProperty(msg,property,undefined);
                  } else if (rule.t === 'set') {
                      PN.util.setMessageProperty(msg,property,value);
                  } else if (rule.t === 'change') {
                      current = PN.util.getMessageProperty(msg,property);
                      if (typeof current === 'string') {
                          if ((fromType === 'num' || fromType === 'bool') && current === fromValue) {
                              // str representation of exact from number/boolean
                              // only replace if they match exactly
                              PN.util.setMessageProperty(msg,property,value);
                          } else {
                              current = current.replace(fromRE,value);
                              PN.util.setMessageProperty(msg,property,current);
                          }
                      } else if ((typeof current === 'number' || current instanceof Number) && fromType === 'num') {
                          if (current == Number(fromValue)) {
                              PN.util.setMessageProperty(msg,property,value);
                          }
                      } else if (typeof current === 'boolean' && fromType === 'bool') {
                          if (current.toString() === fromValue) {
                              PN.util.setMessageProperty(msg,property,value);
                          }
                      }
                  }
              } else {
                  var target;
                  if (rule.pt === 'flow') {
                      target = node.context().flow;
                  } else if (rule.pt === 'global') {
                      target = node.context().global;
                  }
                  if (target) {
                      if (rule.t === 'delete') {
                          target.set(property,undefined);
                      } else if (rule.t === 'set') {
                          target.set(property,value);
                      } else if (rule.t === 'change') {
                          current = target.get(msg,property);
                          if (typeof current === 'string') {
                              if ((fromType === 'num' || fromType === 'bool') && current === fromValue) {
                                  // str representation of exact from number/boolean
                                  // only replace if they match exactly
                                  target.set(property,value);
                              } else {
                                  current = current.replace(fromRE,value);
                                  target.set(property,current);
                              }
                          } else if ((typeof current === 'number' || current instanceof Number) && fromType === 'num') {
                              if (current == Number(fromValue)) {
                                  target.set(property,value);
                              }
                          } else if (typeof current === 'boolean' && fromType === 'bool') {
                              if (current.toString() === fromValue) {
                                  target.set(property,value);
                              }
                          }
                      }
                  }
              }
          } catch(err) {/*console.log(err.stack)*/}
          return msg;
      }
      if (valid) {
          var node = this;
          this.on('input', function(msg) {
              for (var i=0;i<this.rules.length;i++) {
                  if (this.rules[i].t === "move") {
                      var r = this.rules[i];
                      if (r.to.indexOf(r.pt) !== -1) {
                          msg = applyRule(msg,{t:"set", p:r.to, pt:r.tot, to:r.p, tot:r.pt});
                          applyRule(msg,{t:"delete", p:r.p, pt:r.pt});
                      }
                      else { // 2 step move if we are moving to a child
                          msg = applyRule(msg,{t:"set", p:"_temp_move", pt:r.tot, to:r.p, tot:r.pt});
                          applyRule(msg,{t:"delete", p:r.p, pt:r.pt});
                          msg = applyRule(msg,{t:"set", p:r.to, pt:r.tot, to:"_temp_move", tot:r.pt});
                          applyRule(msg,{t:"delete", p:"_temp_move", pt:r.pt});
                      }
                  } else {
                      msg = applyRule(msg,this.rules[i]);
                  }
                  if (msg === null) {
                      return;
                  }
              }
              node.send(msg);
          });
      }
  }

  PN.nodes.registerType("change", ChangeNode);
};
