'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('template', {
    color: "rgb(243, 181, 103)",
    category: 'function',
    defaults: {
      name: { value: "" },
      field: { value: "payload" },
      format: { value: "handlebars" },
      template: { value: "This is the payload: {{payload}} !" }
    },
    inputs: 1,
    outputs: 1,
    faChar: "&#xf121;", //code
    label: function label() {
      return this.name;
    },
    oneditprepare: function oneditprepare() {
      var that = this;
      function templateDialogResize() {
        var rows = $("#dialog-form>div:not(.node-text-editor-row)");
        var height = $("#dialog-form").height();
        for (var i = 0; i < rows.size(); i++) {
          height -= $(rows[i]).outerHeight(true);
        }
        var editorRow = $("#dialog-form>div.node-text-editor-row");
        height -= parseInt(editorRow.css("marginTop")) + parseInt(editorRow.css("marginBottom"));
        $(".node-text-editor").css("height", height + "px");
        that.editor.resize();
      };
      $("#dialog").on("dialogresize", templateDialogResize);
      $("#dialog").one("dialogopen", function (ev) {
        var size = $("#dialog").dialog('option', 'sizeCache-template');
        if (size) {
          $("#dialog").dialog('option', 'width', size.width);
          $("#dialog").dialog('option', 'height', size.height);
          templateDialogResize();
        }
      });
      $("#dialog").one("dialogclose", function (ev, ui) {
        var height = $("#dialog").dialog('option', 'height');
        $("#dialog").off("dialogresize", templateDialogResize);
      });
      this.editor = PN.editor.createEditor({
        id: 'node-input-template-editor',
        mode: 'ace/mode/html',
        value: $("#node-input-template").val()
      });
      // PN.library.create({
      //     url:"functions", // where to get the data from
      //     type:"function", // the type of object the library is for
      //     editor:that.editor, // the field name the main text body goes to
      //     fields:['name','outputs']
      // });
      this.editor.focus();

      $("#node-input-format").change(function () {
        var mod = "ace/mode/" + $("#node-input-format").val();
        that.editor.getSession().setMode({
          path: mod,
          v: Date.now()
        });
      });
    },
    oneditsave: function oneditsave() {
      $("#node-input-template").val(this.editor.getValue());
      delete this.editor;
    },
    render: function render() {
      var snippet1 = '';
      var snippet2 = '';
      var snippet3 = '';
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
            { htmlFor: 'node-input-template' },
            React.createElement('i', { className: 'fa fa-file-code-o' }),
            React.createElement('span', { 'data-i18n': 'template.label.template' })
          ),
          React.createElement('input', {
            type: 'hidden',
            id: 'node-input-template' }),
          React.createElement(
            'select',
            {
              id: 'node-input-format',
              style: { fontSize: '0.8em', marginBottom: 3, width: 110, float: 'right' } },
            React.createElement(
              'option',
              { value: 'handlebars' },
              'mustache'
            ),
            React.createElement(
              'option',
              { value: 'html' },
              'HTML'
            ),
            React.createElement(
              'option',
              { value: 'json' },
              'JSON'
            ),
            React.createElement(
              'option',
              { value: 'markdown' },
              'Markdown'
            ),
            React.createElement(
              'option',
              { value: 'text' },
              'none'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'form-row node-text-editor-row' },
          React.createElement('div', {
            style: { height: 250 },
            className: 'node-text-editor',
            id: 'node-input-template-editor' })
        ),
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-field' },
            React.createElement('i', { className: 'fa fa-edit' }),
            React.createElement('span', { 'data-i18n': 'template.label.property' })
          ),
          'msg.',
          React.createElement('input', { type: 'text', id: 'node-input-field', placeholder: 'payload', style: { width: 170 } })
        )
      );
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          null,
          React.createElement(
            'p',
            null,
            'Creates a new message based on the provided template.'
          ),
          React.createElement(
            'p',
            null,
            'This uses the ',
            React.createElement(
              'i',
              null,
              React.createElement(
                'a',
                { href: 'http://mustache.github.io/mustache.5.html', target: '_new' },
                'mustache'
              )
            ),
            ' format.'
          )
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Creates a new message based on the provided template.'
      );
    }
  });
};