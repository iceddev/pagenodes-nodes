'use strict';

module.exports = function (PN) {
  function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
  }
  PN.nodes.registerType('file', {
    category: 'storage',
    color: 'green',
    defaults: {
      name: { value: '' },
      file: { value: '' },
      injectFile: { value: '' }
    },
    inputs: 0,
    outputs: 1,
    faChar: "&#xf016;", //file-o
    fontColor: "#FFF",
    label: function label() {
      return this.name || 'file';
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic" : "";
    },
    button: {
      onclick: function onclick() {
        var self = this;
        var inputDialog = document.createElement('input');
        inputDialog.id = 'fileUpload';
        inputDialog.type = "file";
        inputDialog.click();
        inputDialog.onchange = function (data) {
          var selectedFile = data.target.files[0];

          console.log('fileInfo', selectedFile);

          if (selectedFile) {
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = function (theFile) {
              console.log('file read finished', theFile);

              PN.comms.rpc('file_upload', [self.id, { payload: selectedFile.name, fileInfo: { data: theFile.target.result, type: selectedFile.type, name: selectedFile.name, size: selectedFile.size } }], function (results) {
                console.log('results', results);
              });
            };

            reader.readAsDataURL(selectedFile);
          }
        };
      }
    },
    render: function render() {
      var NameRow = PN.components.NameRow;

      return React.createElement(NameRow, null);
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          'This button will inject a specified file into a stream'
        ),
        React.createElement(
          'p',
          null,
          'Using the ',
          React.createElement(
            'a',
            { href: 'https://developer.mozilla.org/en-US/docs/Web/API/File' },
            'File API'
          ),
          ' to deliver a file into a flow.  This could be used to parse XML or CSV with a function node.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Inject a File'
      );
    }
  });
};