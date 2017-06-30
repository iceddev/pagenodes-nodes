'use strict';

module.exports = function (PN) {

  PN.nodes.registerType('comment', {
    category: 'function',
    color: "#ffffff",
    defaults: {
      name: { value: "" },
      info: { value: "" }
    },
    inputs: 0,
    outputs: 0,
    faChar: "&#xf075;", //comment
    label: function label() {
      return this.name || "";
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic" : "";
    },
    info: function info() {
      return (this.name ? "# " + this.name + "\n" : "") + (this.info || "");
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
        id: 'node-input-info-editor',
        mode: 'ace/mode/markdown',
        value: $("#node-input-info").val()
      });
      this.editor.focus();
    },
    oneditsave: function oneditsave() {
      $("#node-input-info").val(this.editor.getValue());
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
          { className: 'form-row', style: { marginBottom: "0px" } },
          React.createElement(
            'label',
            { htmlForm: 'node-input-info', style: { width: "100% !important" } },
            React.createElement('i', { className: 'fa fa-comments' }),
            ' ',
            React.createElement('span', { 'data-i18n': 'comment.label.body' })
          ),
          React.createElement('input', { type: 'hidden', id: 'node-input-info', autofocus: 'autofocus' })
        ),
        React.createElement(
          'div',
          { className: 'form-row node-text-editor-row' },
          React.createElement('div', { style: { height: "250px" }, className: 'node-text-editor', id: 'node-input-info-editor' })
        ),
        React.createElement('div', { className: 'form-tips', 'data-i18n': '[html]comment.tip' })
      );
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        'p',
        null,
        'A node you can use to add comments to your flows.'
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'A node you can use to add comments to your flows.'
      );
    }
  });
};