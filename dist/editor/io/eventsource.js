"use strict";

module.exports = function (PN) {
  var _PN$components = PN.components,
      NameRow = _PN$components.NameRow,
      TextRow = _PN$components.TextRow;


  (function () {

    function sse_label() {
      return this.name || "[sse] " + (this.topic || "eventsource");
    }

    PN.nodes.registerType('eventsource', {
      category: 'input',
      defaults: {
        name: {
          value: ""
        },
        topic: {
          value: "",
          required: false
        },
        client: {
          type: "eventsource-client",
          required: true
        }
      },
      color: "rgb(255, 215, 180)",
      inputs: 0,
      outputs: 1,
      //icon: "white-globe.png",
      faChar: '&#xf0ac;', //globe
      labelStyle: function labelStyle() {
        return this.name ? "node_label_italic" : "";
      },
      label: sse_label,
      render: function render() {
        return React.createElement(
          "div",
          null,
          React.createElement(TextRow, { name: "client", icon: "bookmark" }),
          React.createElement(TextRow, { name: "topic", icon: "tag" }),
          React.createElement(NameRow, null)
        );
      },
      renderHelp: function renderHelp() {
        return React.createElement(
          "div",
          null,
          React.createElement(
            "p",
            null,
            "EventSource (Server Sent Events) input node."
          ),
          React.createElement(
            "p",
            null,
            "The event data will be in ",
            React.createElement(
              "b",
              null,
              "msg.payload"
            ),
            ". If no topic is specified, the node will listen for unnamed messages."
          )
        );
      },
      renderDescription: function renderDescription() {
        return React.createElement(
          "p",
          null,
          "EventSource Input Node"
        );
      }
    });

    PN.nodes.registerType('eventsource-client', {
      category: 'config',
      defaults: {
        path: {
          value: "",
          required: true
        }
      },
      inputs: 0,
      outputs: 0,
      label: function label() {
        if (this.path && this.path.length > 35) {
          return this.path.substring(0, 33) + '...';
        }
        return this.path;
      },
      render: function render() {
        return React.createElement(
          "div",
          null,
          React.createElement(TextRow, { name: "path", icon: "bookmark", placeholder: "https://example.com/sse", config: true }),
          React.createElement(
            "div",
            { className: "form-tips" },
            React.createElement(
              "p",
              null,
              React.createElement(
                "span",
                null,
                "This will need to a be a CORS compliant HTTPS URL."
              )
            )
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
            "This configuration node connects an EventSource (Server Sent Events) client to the specified URL."
          )
        );
      },
      renderDescription: function renderDescription() {
        return React.createElement(
          "p",
          null,
          "EventSource Output Node"
        );
      }
    });
  })();
};