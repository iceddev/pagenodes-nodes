'use strict';

module.exports = function (PN) {

  //**dataURL to blob**
  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  //**blob to dataURL**
  function blobToDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = function (e) {
      callback(e.target.result);
    };
    a.readAsDataURL(blob);
  }

  PN.nodes.registerType('debug', {
    order: 1,
    category: 'output',
    defaults: {
      name: { value: "" },
      active: { value: true },
      console: { value: "false" },
      complete: { value: "false", required: true }
    },
    label: function label() {
      if (this.complete === true || this.complete === "true") {
        return this.name || "msg";
      } else {
        return this.name || "msg." + (!this.complete || this.complete === "false" ? "payload" : this.complete);
      }
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic" : "";
    },
    color: "#87a980",
    inputs: 1,
    outputs: 0,
    faChar: "&#xf03a;", //list
    align: "right",
    button: {
      toggle: "active",
      onclick: function onclick() {
        var label = this.name || "debug";
        var node = this;
        PN.comms.rpc('debug', [this.id, this.active ? "enable" : "disable"], function (result) {
          if (result == 200) {
            PN.notify(node._("debug.notification.activated", { label: label }), "success");
          } else if (result == 201) {
            PN.notify(node._("debug.notification.deactivated", { label: label }), "success");
          }
        });
      }
    },
    onpaletteadd: function onpaletteadd() {
      var content = document.createElement("div");
      $(content).css({ "position": "relative", "height": "100%" });

      var inputbar = document.createElement("div");
      inputbar.id = "input-toolbar";
      content.appendChild(inputbar);

      inputbar.innerHTML = '<table><tr>\n        <td>\n          <input type="checkbox" id="debug-tab-onkey-checkbox">\n        </td>\n        <td>\n          <input id="debug-tab-input" type="text" />\n        </td>\n        <td>\n          <a id="debug-tab-input-send" title="send" class="button" href="#" style="margin: 5px;"><i class="fa fa-play"></i></a>\n        </td>\n      </tr></table>';

      var styleTag = document.createElement("style");
      content.appendChild(styleTag);

      styleTag.innerHTML = '\n      #debug-content {\n      position: absolute;\n      top: 70px;\n      bottom: 0px;\n      left:0px;\n      right: 0px;\n      overflow-y: scroll;\n      }\n      #debug-toolbar {\n      padding: 3px 10px;\n      height: 24px;\n      background: #f3f3f3;\n      }\n      #input-toolbar {\n      height: 34px;\n      background: #f3f3f3;\n      padding: 3px;\n      }\n      #debug-tab-input-send {\n      float: right;\n      margin: 5px;\n      }\n      .debug-message {\n      cursor: pointer;\n      border-bottom: 1px solid #eee;\n      border-left: 8px solid #eee;\n      border-right: 8px solid #eee;\n      padding: 2px;\n      }\n      .debug-message-date {\n      background: #fff;\n      font-size: 9px;\n      color: #aaa;\n      padding: 1px 5px 1px 1px;\n      }\n      .debug-message-topic {\n      display: block;\n      background: #fff;\n      padding: 1px;\n      font-size: 10px;\n      color: #a66;\n      }\n      .debug-message-name {\n      background: #fff;\n      padding: 1px 5px;\n      font-size: 9px;\n      color: #aac;\n      }\n      .debug-message-payload {\n      display: block;\n      padding: 2px;\n      background: #fff;\n      }\n      .debug-message-level-log {\n      border-left-color: #eee;\n      border-right-color: #eee;\n      }\n      .debug-message-level-30 {\n      border-left-color: #ffdf9d;\n      border-right-color: #ffdf9d;\n      }\n      .debug-message-level-20 {\n      border-left-color: #f99;\n      border-right-color: #f99;\n      }';

      var toolbar = document.createElement("div");
      toolbar.id = "debug-toolbar";
      content.appendChild(toolbar);

      toolbar.innerHTML = '<div class="pull-left">\n        <a id="debug-tab-clear" title="clear log" class="button" href="#"><i class="fa fa-trash"></i></a>\n      </div>';

      var messages = document.createElement("div");
      messages.id = "debug-content";

      content.appendChild(messages);

      PN.sidebar.addTab({
        id: "debug",
        label: this._("debug.sidebar.label"),
        name: this._("debug.sidebar.name"),
        content: content
      });

      function getTimestamp() {
        var d = new Date();
        return d.toLocaleString();
      }

      var sbc = document.getElementById("debug-content");

      var messageCount = 0;
      var that = this;
      PN._debug = function (msg) {
        that.handleDebugMessage("", {
          name: "debug",
          msg: msg
        });
      };
      function sanitize(m) {
        return m.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }
      this.handleDebugMessage = function (t, o) {
        var msg = document.createElement("div");
        // console.log('handleDebug', o);
        msg.onmouseover = function () {
          msg.style.borderRightColor = "#999";
          var n = PN.nodes.node(o.id);
          if (n) {
            n.highlighted = true;
            n.dirty = true;
          }
          PN.view.redraw();
        };
        msg.onmouseout = function () {
          msg.style.borderRightColor = "";
          var n = PN.nodes.node(o.id);
          if (n) {
            n.highlighted = false;
            n.dirty = true;
          }
          PN.view.redraw();
        };
        msg.onclick = function () {
          var node = PN.nodes.node(o.id);
          if (node) {
            PN.workspaces.show(node.z);
          }
        };
        //console.log(o);
        var name = sanitize(((o.name ? o.name : o.id) || "").toString());
        var topic = sanitize((o.topic || "").toString());
        var property = sanitize(o.property ? o.property : '');
        var payload = sanitize((o.msg || "").toString());
        var format = sanitize((o.format || "").toString());

        msg.className = 'debug-message' + (o.level ? ' debug-message-level-' + o.level : '');
        msg.innerHTML = '<span class="debug-message-date">' + getTimestamp() + '</span>' + (name ? '<span class="debug-message-name">' + name : '') + '</span>';
        // NOTE: relying on function error to have a "type" that all other msgs don't
        if (o.hasOwnProperty("type") && o.type === "function") {
          var errorLvlType = 'error';
          var errorLvl = 20;
          if (o.hasOwnProperty("level") && o.level === 30) {
            errorLvl = 30;
            errorLvlType = 'warn';
          }
          msg.className = 'debug-message debug-message-level-' + errorLvl;
          msg.innerHTML += '<span class="debug-message-topic">function : (' + errorLvlType + ')</span>';
        } else {
          msg.innerHTML += '<span class="debug-message-topic">' + (o.topic ? topic + ' : ' : '') + (o.property ? 'msg.' + property : 'msg') + " : " + format + '</span>';
        }
        var imgHTML = '';
        if (o.image) {
          var imgURL = o.image.replace(/\"/g, '').replace(/\'/g, '');
          imgHTML = '<br><img src=\"' + imgURL + '\" style=\"width: 100%\">';
        }
        var fileHTML = '';
        if (o.file) {
          var download = sanitize(o.file.fileInfo.name.replace(/\"/g, '').replace(/\'/g, ''));

          // var dataURL = o.file.fileInfo.data.replace(/\"/g,'').replace(/\'/g,'');
          var blob = dataURLtoBlob(o.file.fileInfo.data);
          var url = URL.createObjectURL(blob);

          fileHTML = '<br><a href=\"' + url + '\" download=\"' + download + '\" target=\"_blank\">' + download + '</a>';
        }
        msg.innerHTML += '<span class="debug-message-payload">' + payload + imgHTML + fileHTML + '</span>';
        var atBottom = sbc.scrollHeight - messages.offsetHeight - sbc.scrollTop < 5;
        messageCount++;
        $(messages).append(msg);

        if (messageCount > 200) {
          $("#debug-content .debug-message:first").remove();
          messageCount--;
        }
        if (atBottom) {
          $(sbc).scrollTop(sbc.scrollHeight);
        }
      };
      PN.comms.subscribe("debug", this.handleDebugMessage);

      $("#debug-tab-clear").click(function () {
        $(".debug-message").remove();
        messageCount = 0;
        PN.nodes.eachNode(function (node) {
          node.highlighted = false;
          node.dirty = true;
        });
        PN.view.redraw();
      });

      $('#debug-tab-onkey-checkbox').change(function () {
        // console.log('debug-tab-onkey-checkbox', this.checked);
        if (this.checked) {
          return $('#debug-tab-input-send').hide();
        }
        $('#debug-tab-input-send').show();
      });

      function sendText() {
        var textToSend = $('#debug-tab-input')[0].value;
        $('#debug-tab-input')[0].value = '';

        // console.log($("#debug-tab-input").value);
        if (textToSend) {
          PN.comms.rpc('inject_text', [textToSend], function (result) {
            //PN.notify(node._("inject.success",{label:label}),"success");
            PN.notify(PN._("text inject success", { ok: 'ok' }), "success");
          });
        }
      }
      $("#debug-tab-input-send").click(sendText);
      $('#debug-tab-input').keyup(function (e) {

        // console.log('event ', e);
        e.stopPropagation();
        e.preventDefault();
        e.returnValue = false;
        e.cancelBubble = true;
        if (e.keyCode == 13 || $('#debug-tab-onkey-checkbox').prop('checked')) {
          sendText();
        }
        return false;
      });
    },
    onpaletteremove: function onpaletteremove() {
      PN.comms.unsubscribe("debug", this.handleDebugMessage);
      PN.sidebar.removeTab("debug");
      delete PN._debug;
    },
    oneditprepare: function oneditprepare() {
      console.log('oneditprepare is running now');
      if (this.complete === "true" || this.complete === true) {
        // show complete message object
        $("#node-input-select-complete").val("true");
        $("#node-prop-row").hide();
      } else {
        // show msg.[   ]
        var property = !this.complete || this.complete === "false" ? "payload" : this.complete + "";
        $("#node-input-select-complete").val("false");
        $("#node-input-complete").val(property);
        $("#node-prop-row").show();
      }
      $("#node-input-select-complete").change(function () {
        var v = $("#node-input-select-complete option:selected").val();
        $("#node-input-complete").val(v);
        if (v !== "true") {
          $("#node-input-complete").val("payload");
          $("#node-prop-row").show();
          $("#node-input-complete").focus();
        } else {
          $("#node-prop-row").hide();
        }
      });
    },
    render: function render() {
      var NameRow = PN.components.NameRow;


      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-select-complete' },
            React.createElement('i', { className: 'fa fa-list' }),
            ' ',
            React.createElement('span', { 'data-i18n': 'debug.output' })
          ),
          React.createElement(
            'select',
            { type: 'text', id: 'node-input-select-complete', style: { display: "inline-block", width: "250px", verticalAlign: "top" } },
            React.createElement('option', { value: 'false', 'data-i18n': 'debug.msgprop' }),
            React.createElement('option', { value: 'true', 'data-i18n': 'debug.msgobj' })
          )
        ),
        React.createElement(
          'div',
          { className: 'form-row', id: 'node-prop-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-complete' },
            '\xA0'
          ),
          'msg.',
          React.createElement('input', { type: 'text', style: { width: "208px" }, id: 'node-input-complete' })
        ),
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-console' },
            React.createElement('i', { className: 'fa fa-random' }),
            ' ',
            React.createElement('span', { 'data-i18n': 'debug.to' })
          ),
          React.createElement(
            'select',
            { type: 'text', id: 'node-input-console', style: { display: "inline-block", width: "250px", verticalAlign: "top" } },
            React.createElement('option', { value: 'false', 'data-i18n': 'debug.debtab' }),
            React.createElement('option', { value: 'true', 'data-i18n': 'debug.tabcon' })
          )
        ),
        React.createElement(NameRow, null)
      );
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          'The Debug node can be connected to the output of any node. It can be used to display the output of any message property in the debug tab of the sidebar. The default is to display ',
          React.createElement(
            'b',
            null,
            'msg.payload'
          ),
          '.'
        ),
        React.createElement(
          'p',
          null,
          'Each message will also display the timestamp, ',
          React.createElement(
            'b',
            null,
            'msg.topic'
          ),
          ' and the property chosen to output.'
        ),
        React.createElement(
          'p',
          null,
          'The sidebar can be accessed under the options drop-down in the top right corner.'
        ),
        React.createElement(
          'p',
          null,
          'The button to the right of the node will toggle its output on and off so you can de-clutter the debug window.'
        ),
        React.createElement(
          'p',
          null,
          'If the payload is an object or buffer it will be stringified first for display and indicate that by saying "(Object)" or "(Buffer)".'
        ),
        React.createElement(
          'p',
          null,
          'Selecting any particular message will highlight (in red) the debug node that reported it. This is useful if you wire up multiple debug nodes.'
        ),
        React.createElement(
          'p',
          null,
          'Optionally can show the complete ',
          React.createElement(
            'b',
            null,
            'msg'
          ),
          ' object.'
        ),
        React.createElement(
          'p',
          null,
          'In addition any calls to node.warn or node.error will appear here.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Display the output of any node.'
      );
    }
  });
};