'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('function', {
    color: "#fdd0a2",
    category: 'function',
    defaults: {
      name: { value: "" },
      func: { value: "\nreturn msg;" },
      outputs: { value: 1 },
      noerr: { value: 0, required: true, validate: function validate(v) {
          return !v || v === 0 ? true : false;
        } }
    },
    inputs: 1,
    outputs: 1,
    faChar: 'ƒ',
    label: function label() {
      return this.name;
    },
    oneditprepare: function oneditprepare() {
      var that = this;
      $("#node-input-outputs").spinner({
        min: 1
      });

      function functionDialogResize() {
        var rows = $("#dialog-form>div:not(.node-text-editor-row)");
        var height = $("#dialog-form").height();
        for (var i = 0; i < rows.size(); i++) {
          height -= $(rows[i]).outerHeight(true);
        }
        var editorRow = $("#dialog-form>div.node-text-editor-row");
        height -= parseInt(editorRow.css("marginTop")) + parseInt(editorRow.css("marginBottom"));
        $(".node-text-editor").css("height", height + "px");
        that.editor.resize();
      }
      $("#dialog").on("dialogresize", functionDialogResize);
      $("#dialog").one("dialogopen", function (ev) {
        var size = $("#dialog").dialog('option', 'sizeCache-function');
        if (size) {
          $("#dialog").dialog('option', 'width', size.width);
          $("#dialog").dialog('option', 'height', size.height);
          functionDialogResize();
        }
      });
      $("#dialog").one("dialogclose", function (ev, ui) {
        var height = $("#dialog").dialog('option', 'height');
        $("#dialog").off("dialogresize", functionDialogResize);
      });

      this.editor = PN.editor.createEditor({
        id: 'node-input-func-editor',
        mode: 'ace/mode/javascript',
        value: $("#node-input-func").val()
      });

      // PN.library.create({
      //     url:"functions", // where to get the data from
      //     type:"function", // the type of object the library is for
      //     editor:this.editor, // the field name the main text body goes to
      //     mode:"ace/mode/javascript",
      //     fields:['name','outputs']
      // });
      this.editor.focus();
    },
    oneditsave: function oneditsave() {
      var annot = this.editor.getSession().getAnnotations();
      this.noerr = 0;
      $("#node-input-noerr").val(0);
      for (var k = 0; k < annot.length; k++) {
        //console.log(annot[k].type,":",annot[k].text, "on line", annot[k].row);
        if (annot[k].type === "error") {
          $("#node-input-noerr").val(annot.length);
          this.noerr = annot.length;
        }
      }
      $("#node-input-func").val(this.editor.getValue());
      delete this.editor;
    },
    render: function render() {
      var NameRow = PN.components.NameRow;

      return React.createElement(
        'div',
        null,
        React.createElement(NameRow, null),
        React.createElement(
          'div',
          {
            className: 'form-row',
            style: { marginBottom: 0 } },
          React.createElement(
            'label',
            { htmlFor: 'node-input-func' },
            React.createElement('i', { className: 'fa fa-wrench' }),
            React.createElement('span', { 'data-i18n': 'function.label.function' })
          ),
          React.createElement('input', {
            type: 'hidden',
            id: 'node-input-func',
            autofocus: 'autofocus' }),
          React.createElement('input', { type: 'hidden', id: 'node-input-noerr' })
        ),
        React.createElement(
          'div',
          { className: 'form-row node-text-editor-row' },
          React.createElement('div', {
            style: { height: 250 },
            className: 'node-text-editor',
            id: 'node-input-func-editor' })
        ),
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-outputs' },
            React.createElement('i', { className: 'fa fa-random' }),
            React.createElement('span', { 'data-i18n': 'function.label.outputs' })
          ),
          React.createElement('input', {
            id: 'node-input-outputs',
            style: { width: 60, height: '1.7em' },
            defaultValue: 1 })
        ),
        React.createElement(
          'div',
          { className: 'form-tips' },
          React.createElement('span', { 'data-i18n': 'function.tip' })
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
          'A function block where you can write code to do more interesting things.'
        ),
        React.createElement(
          'p',
          null,
          'The message is passed in as a JavaScript object called ',
          React.createElement(
            'code',
            null,
            'msg'
          ),
          '.'
        ),
        React.createElement(
          'p',
          null,
          'By convention it will have a ',
          React.createElement(
            'code',
            null,
            'msg.payload'
          ),
          ' property containing the body of the message.'
        ),
        React.createElement(
          'h4',
          null,
          'Logging and Error Handling'
        ),
        React.createElement(
          'p',
          null,
          'To log any information, or report an error, the following functions are available:'
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
              'node.log("Log")'
            )
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'code',
              null,
              'node.warn("Warning")'
            )
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'code',
              null,
              'node.error("Error")'
            )
          )
        ),
        React.createElement(
          'h4',
          null,
          'Sending messages'
        ),
        React.createElement(
          'p',
          null,
          'The function can either return the messages it wants to pass on to the next nodes in the flow, or can call ',
          React.createElement(
            'code',
            null,
            'node.send(messages)'
          ),
          '.'
        ),
        React.createElement(
          'p',
          null,
          'It can return/send:'
        ),
        React.createElement(
          'ul',
          null,
          React.createElement(
            'li',
            null,
            'a single message object - passed to nodes connected to the first output'
          ),
          React.createElement(
            'li',
            null,
            'an array of message objects - passed to nodes connected to the corresponding outputs'
          )
        ),
        React.createElement(
          'p',
          null,
          'If any element of the array is itself an array of messages, multiple messages are sent to the corresponding output.'
        ),
        React.createElement(
          'p',
          null,
          'If null is returned, either by itself or as an element of the array, no message is passed on.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Create functions for data with javascript'
      );
    }
  });
};