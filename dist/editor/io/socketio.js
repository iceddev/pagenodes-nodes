"use strict";

module.exports = function (PN) {

  function ws_oneditprepare() {
    $("#websocket-client-row").show();

    // if(this.client) {
    //     $("#node-input-mode").val('client').change();
    // }
    // else {
    //     $("#node-input-mode").val('server').change();
    // }
  }

  function ws_oneditsave() {
    // if($("#node-input-mode").val() === 'client') {
    $("#node-input-server").append('<option value="">Dummy</option>');
    $("#node-input-server").val('');
    // }
    // else {
    //     $("#node-input-client").append('<option value="">Dummy</option>');
    //     $("#node-input-client").val('');
    // }
  }

  function ws_label() {
    var nodeid = this.client ? this.client : this.server;
    var wsNode = PN.nodes.node(nodeid);
    return this.name || (wsNode ? "[ws] " + wsNode.label() : "socketio");
  }

  function ws_validateserver() {
    if ($("#node-input-mode").val() === 'client' || this.client && !this.server) {
      return true;
    } else {
      return PN.nodes.node(this.server) != null;
    }
  }

  function ws_validateclient() {
    if ($("#node-input-mode").val() === 'client' || this.client && !this.server) {
      return PN.nodes.node(this.client) != null;
    } else {
      return true;
    }
  }

  PN.nodes.registerType('socketio in', {
    category: 'input',
    defaults: {
      name: { value: "" },
      topic: { value: "", required: true },
      client: { type: "socketio-client", validate: ws_validateclient }
    },
    color: "rgb(215, 215, 160)",
    inputs: 0,
    outputs: 1,
    //icon: "white-globe.png",
    faChar: '&#xf0ac;', //globe
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic" : "";
    },
    label: ws_label,
    oneditsave: ws_oneditsave,
    oneditprepare: ws_oneditprepare,
    render: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          {
            className: "form-row",
            id: "websocket-client-row" },
          React.createElement(
            "label",
            { htmlFor: "node-input-client" },
            React.createElement("i", { className: "fa fa-bookmark" }),
            React.createElement("span", { "data-i18n": "websocket.label.url" })
          ),
          React.createElement("input", { type: "text", id: "node-input-client" })
        ),
        React.createElement(
          "div",
          { className: "form-row" },
          React.createElement(
            "label",
            { htmlFor: "node-input-topic" },
            React.createElement("i", { className: "fa fa-tag" }),
            React.createElement("span", { "data-i18n": "common.label.topic" })
          ),
          React.createElement("input", {
            type: "text",
            id: "node-input-topic",
            "data-i18n": "[placeholder]common.label.topic" })
        ),
        React.createElement(
          "div",
          { className: "form-row" },
          React.createElement(
            "label",
            { htmlFor: "node-input-name" },
            React.createElement("i", { className: "fa fa-tag" }),
            React.createElement("span", { "data-i18n": "common.label.name" })
          ),
          React.createElement("input", {
            type: "text",
            id: "node-input-name",
            "data-i18n": "[placeholder]common.label.name" })
        )
      );
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          null,
          "Socket.io input node."
        ),
        React.createElement(
          "p",
          null,
          "By default, the data received from the WebSocket will be in ",
          React.createElement(
            "b",
            null,
            "msg.payload"
          ),
          ". The socket can be configured to expect a properly formed JSON string, in which case it will parse the JSON and send on the resulting object as the entire message."
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        "p",
        null,
        "input from a socket.io sever"
      );
    }
  });

  PN.nodes.registerType('socketio out', {
    category: 'output',
    defaults: {
      name: { value: "" },
      client: { type: "socketio-client", validate: ws_validateclient }
    },
    color: "rgb(215, 215, 160)",
    inputs: 1,
    outputs: 0,
    //icon: "white-globe.png",
    faChar: '&#xf0ac;', //globe
    align: "right",
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic" : "";
    },
    label: ws_label,
    oneditsave: ws_oneditsave,
    oneditprepare: ws_oneditprepare,
    render: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          {
            className: "form-row",
            id: "websocket-client-row" },
          React.createElement(
            "label",
            { htmlFor: "node-input-client" },
            React.createElement("i", { className: "fa fa-bookmark" }),
            React.createElement("span", { "data-i18n": "websocket.label.url" })
          ),
          React.createElement("input", { type: "text", id: "node-input-client" })
        ),
        React.createElement(
          "div",
          { className: "form-row" },
          React.createElement(
            "label",
            { htmlFor: "node-input-name" },
            React.createElement("i", { className: "fa fa-tag" }),
            React.createElement("span", { "data-i18n": "common.label.name" })
          ),
          React.createElement("input", {
            type: "text",
            id: "node-input-name",
            "data-i18n": "[placeholder]common.label.name" })
        )
      );
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          null,
          "Socket.io out node."
        ),
        React.createElement(
          "p",
          null,
          "By default, ",
          React.createElement(
            "b",
            null,
            "msg.payload"
          ),
          " will be sent over the WebSocket. The socket can be configured to encode the entire message object as a JSON string and send that over the WebSocket."
        ),
        React.createElement(
          "p",
          null,
          "If the message arriving at this node started at a WebSocket In node, the message will be sent back to the client that triggered the flow. Otherwise, the message will be broadcast to all connected clients."
        ),
        React.createElement(
          "p",
          null,
          "If you want to broadcast a message that started at a WebSocket In node, you should delete the ",
          React.createElement(
            "b",
            null,
            "msg._session"
          ),
          " property within the flow"
        ),
        "."
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        "p",
        null,
        "output to a socket.io sever"
      );
    }
  });

  PN.nodes.registerType('socketio-client', {
    category: 'config',
    defaults: {
      path: { value: "", required: true, validate: PN.validators.regex(/^((?!\/debug\/ws).)*$/) }
    },
    inputs: 0,
    outputs: 0,
    label: function label() {
      return this.path;
    },
    render: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { className: "form-row" },
          React.createElement(
            "label",
            { htmlFor: "node-config-input-path" },
            React.createElement("i", { className: "fa fa-bookmark" }),
            React.createElement("span", { "data-i18n": "websocket.label.url" })
          ),
          React.createElement("input", {
            type: "text",
            id: "node-config-input-path",
            placeholder: "ws://example.com/ws" })
        ),
        React.createElement(
          "div",
          { className: "form-tips" },
          React.createElement(
            "p",
            null,
            React.createElement("span", { "data-i18n": "[html]websocket.tip.url1" })
          ),
          React.createElement("span", { "data-i18n": "[html]websocket.tip.url2" })
        )
      );
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          null,
          "This configuration node connects a WebSocket client to the specified URL."
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        "p",
        null,
        "Connect to a WebSocket Server as a client"
      );
    }
  });
};