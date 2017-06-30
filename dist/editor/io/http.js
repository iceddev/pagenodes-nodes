'use strict';

module.exports = function (PN) {
  var _PN$components = PN.components,
      NameRow = _PN$components.NameRow,
      TextRow = _PN$components.TextRow,
      SelectRow = _PN$components.SelectRow;


  PN.nodes.registerType('http request', {
    category: 'function',
    color: "rgb(231, 231, 174)",
    defaults: {
      name: {
        value: ""
      },
      method: {
        value: "GET"
      },
      ret: {
        value: "txt"
      },
      url: {
        value: ""
      }
      //user -> credentials
      //pass -> credentials
    },
    // credentials: {
    //     user: {type:"text"},
    //     password: {type: "password"}
    // },
    inputs: 1,
    outputs: 1,
    //icon: "white-globe.png",
    faChar: '&#xf0ac;', //globe
    label: function label() {
      return this.name || this._("httpin.httpreq");
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic" : "";
    },
    oneditprepare: function oneditprepare() {
      // if (this.credentials.user || this.credentials.has_password) {
      //     $('#node-input-useAuth').prop('checked', true);
      //     $(".node-input-useAuth-row").show();
      // } else {
      //     $('#node-input-useAuth').prop('checked', false);
      //     $(".node-input-useAuth-row").hide();
      // }

      $("#node-input-useAuth").change(function () {
        if ($(this).is(":checked")) {
          $(".node-input-useAuth-row").show();
        } else {
          $(".node-input-useAuth-row").hide();
          $('#node-input-user').val('');
          $('#node-input-password').val('');
        }
      });

      $("#node-input-ret").change(function () {
        if ($("#node-input-ret").val() === "obj") {
          $("#tip-json").show();
        } else {
          $("#tip-json").hide();
        }
      });
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(SelectRow, { name: 'method', icon: 'tasks', options: ['GET', 'POST', 'PUT', 'DELETE'] }),
        React.createElement(TextRow, { name: 'url', placeholder: 'https://', icon: 'glob' }),
        React.createElement(NameRow, null),
        React.createElement(
          'div',
          { className: 'form-tips', id: 'tip-json', hidden: true },
          React.createElement('span', { 'data-i18n': 'httpin.tip.req' })
        )
      );
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          'Provides a node for making http requests.'
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'i',
            null,
            '*All addresses must be https:// and have CORS enabled'
          )
        ),
        React.createElement(
          'p',
          null,
          'The URL and HTTP method can be configured in the node, if they are left blank they should be set in an incoming message on ',
          React.createElement(
            'code',
            null,
            'msg.url'
          ),
          ' and ',
          React.createElement(
            'code',
            null,
            'msg.method'
          ),
          ':'
        ),
        React.createElement(
          'ul',
          null,
          React.createElement(
            'li',
            null,
            React.createElement(
              'code',
              null,
              'url'
            ),
            ', if set, is used as the url of the request. Must start with http: or https:'
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'code',
              null,
              'method'
            ),
            ', if set, is used as the HTTP method of the request. Must be one of ',
            React.createElement(
              'code',
              null,
              'GET'
            ),
            ', ',
            React.createElement(
              'code',
              null,
              'PUT'
            ),
            ', ',
            React.createElement(
              'code',
              null,
              'POST'
            ),
            ', ',
            React.createElement(
              'code',
              null,
              'PATCH'
            ),
            ' or ',
            React.createElement(
              'code',
              null,
              'DELETE'
            ),
            ' (default: GET)'
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'code',
              null,
              'headers'
            ),
            ', if set, should be an object containing field/value pairs to be added as request headers'
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'code',
              null,
              'payload'
            ),
            ' is sent as the body of the request'
          )
        ),
        React.createElement(
          'p',
          null,
          'When configured within the node, the URL property can contain ',
          React.createElement(
            'a',
            { href: 'http://mustache.github.io/mustache.5.html', target: '_new' },
            'mustache-style'
          ),
          ' tags. These allow the url to be constructed using values of the incoming message. For example, if the url is set to',
          React.createElement(
            'code',
            null,
            'example.com/'
          ),
          ', it will have the value of ',
          React.createElement(
            'code',
            null,
            'msg.topic'
          ),
          ' automatically inserted. Using  prevents mustache from escaping characters like / & etc.'
        ),
        React.createElement(
          'p',
          null,
          'The output message contains the following properties:'
        ),
        React.createElement(
          'ul',
          null,
          React.createElement(
            'li',
            null,
            React.createElement(
              'code',
              null,
              'payload'
            ),
            ' is the body of the response'
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'code',
              null,
              'statusCode'
            ),
            ' is the status code of the response, or the error code if the request could not be completed'
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'code',
              null,
              'headers'
            ),
            ' is an object containing the response headers'
          )
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Makes http requests to CORS enabled servers'
      );
    }
  });
};