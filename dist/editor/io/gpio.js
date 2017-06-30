'use strict';

var _ = require('lodash');

module.exports = function (PN) {
  var _PN$components = PN.components,
      NameRow = _PN$components.NameRow,
      TextRow = _PN$components.TextRow,
      SelectRow = _PN$components.SelectRow;


  var DEFAULT_SELECTED_EXAMPLE = 'led-blink.js';

  function loadExamples(j5Node) {

    var exampleFiles;

    $('#node-config-examples').click(function () {
      console.log('examples button clicked');

      try {

        $("#scriptTextarea").val('');

        PN.comms.rpc('gpio/getExamples', [], function (data) {
          if (data.error) {
            console.log('error retrieving examples', data.error);
            return;
          }

          console.log('getExamples', data);

          var exampleScriptsSelect = $('#exampleScripts');
          exampleScriptsSelect.find('option').remove();
          exampleFiles = data.entity.files || {};
          _.forEach(exampleFiles, function (file) {
            var op = $("<option></option>").attr("value", file.filename).text(file.filename);

            exampleScriptsSelect.append(op);
          });

          exampleScriptsSelect.change(function (a) {
            var selectedFile = exampleFiles[exampleScriptsSelect.val()];
            console.log('selected file', selectedFile);
            $("#scriptTextarea").val(selectedFile.content);
          });

          exampleScriptsSelect.val(DEFAULT_SELECTED_EXAMPLE);
          try {
            $("#scriptTextarea").val(exampleFiles[DEFAULT_SELECTED_EXAMPLE].content);
          } catch (exp) {}

          launchDialog();
        });
      } catch (ex) {
        console.log('error loading j5 examples', ex);
      }

      function launchDialog() {
        var dialog = $("#examplesListDialog");
        dialog.dialog({
          modal: true,
          width: 'auto',
          buttons: [{
            text: "USE SCRIPT",
            click: function click() {
              var selectedVal = $("#exampleScripts").val();
              console.log('selectedVal', selectedVal);
              if (selectedVal && exampleFiles[selectedVal] && exampleFiles[selectedVal].content) {

                console.log('selected val from dialog', selectedVal);
                j5Node.editor.setValue(exampleFiles[selectedVal].content);
              }
              $(this).dialog("close");
            }
          }, {
            text: "CANCEL",
            click: function click() {
              $(this).dialog("close");
            }
          }]
        });
      }
    });
  }

  PN.nodes.registerType('gpio in', {
    category: 'robotics',
    defaults: {
      name: { value: "" },
      state: { value: "INPUT", required: true },
      samplingInterval: { value: "300", required: false },
      pin: { value: "", required: false },
      board: { type: "nodebot", required: true }
    },
    color: "#f6de1d",
    inputs: 0,
    outputs: 1,
    faChar: "&#xf22c;", //neuter
    faColor: "black",
    label: function label() {
      return this.name || "gpio" + this.pin;
    },
    oneditprepare: function oneditprepare() {

      var self = this;

      function showInterval() {
        $("#node-div-samplingIntervalRow").show();
      }
      function hideInterval() {
        $("#node-div-samplingIntervalRow").hide();
      }

      if (self.state === 'ANALOG') {
        showInterval();
      } else {
        hideInterval();
      }

      var intervalInput = $("#node-input-state");
      intervalInput.change(function () {
        // console.log('intervalInput changed', this.value);
        if (this.value === 'ANALOG') {
          showInterval();
        } else {
          hideInterval();
        }
      });
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(TextRow, { name: 'board', icon: 'tasks' }),
        React.createElement(SelectRow, { name: 'state', icon: 'wrench', options: [['Digital Pin', 'INPUT'], ['Analog Pin', 'ANALOG']] }),
        React.createElement(TextRow, { name: 'samplingInterval', icon: 'circle', label: 'sampling interval', placeholder: '300' }),
        React.createElement(TextRow, { name: 'pin', icon: 'neuter', placeholder: '2' }),
        React.createElement(NameRow, null),
        React.createElement(
          'div',
          { className: 'form-tips', id: 'node-div-formTipRow' },
          React.createElement(
            'b',
            null,
            'Note:'
          ),
          ' You cannot use the same pin for both output and input.'
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
          'gpio input node. A node for receiving data from General Purpose Input and Outputs (GPIOs) pins though the use of johnny-five I/O Plugins'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'GPIO Input Node'
      );
    }
  });

  PN.nodes.registerType('gpio out', {
    category: 'robotics',
    defaults: {
      name: { value: "" },
      state: { value: "OUTPUT", required: true },
      pin: { value: "", required: false },
      outputs: { value: 0 },
      board: { type: "nodebot", required: true }
    },
    color: "#f6de1d",
    inputs: 1,
    outputs: 0,
    faChar: "&#xf22c;", //neuter
    faColor: "black",
    align: "right",
    label: function label() {
      // console.log('name', "gpio"+(this.pin || this.i2cAddress || ''));
      return this.name || "gpio" + (this.pin || this.i2cAddress || '');
    },
    oneditprepare: function oneditprepare() {

      var self = this;

      var stateInput = $("#node-input-state");
      stateInput.change(function () {
        console.log('stateInput changed', this.value);
      });
    },
    oneditsave: function oneditsave(a) {
      var stateInput = $("#node-input-state");
      this.outputs = 0;
      console.log('saving', this, a, stateInput.val());
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(TextRow, { name: 'board', icon: 'tasks' }),
        React.createElement(SelectRow, { name: 'state', icon: 'wrench', options: [['Digital (0/1)', 'OUTPUT'], ['Analog (0-255)', 'PWM'], ['Servo (0-180)', 'SERVO']] }),
        React.createElement(TextRow, { name: 'pin', icon: 'neuter', placeholder: '13' }),
        React.createElement(NameRow, null),
        React.createElement(
          'div',
          {
            className: 'form-tips',
            id: 'node-div-formTipRow' },
          React.createElement(
            'b',
            null,
            'Note:'
          ),
          ' You cannot use the same pin for both output and input.'
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
          'gpio output node. A node for sending data to General Purpose Input and Outputs (GPIOs) pins though the use of johnny-five I/O Plugins'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'GPIO Output Node'
      );
    }
  });

  PN.nodes.registerType('pixel', {
    category: 'robotics',
    defaults: {
      name: { value: "", required: false },
      pin: { value: "", required: false },
      length: { value: "", required: true },
      controller: { value: "FIRMATA", required: true },
      board: { type: "nodebot", required: true }
    },
    color: "#f6de1d",
    inputs: 1,
    outputs: 0,
    faChar: "&#xf185;", //sun-o
    faColor: "black",
    align: "right",
    label: function label() {
      return this.name || "neopixel";
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(TextRow, { name: 'board', icon: 'tasks' }),
        React.createElement(SelectRow, { name: 'controller', icon: 'wrench', options: [['Firmata', 'FIRMATA'], ['I2C Backpack', 'I2CBACKPACK']] }),
        React.createElement(TextRow, { name: 'pin', icon: 'neuter', placeholder: '6' }),
        React.createElement(TextRow, { name: 'length', icon: 'arrows-h', placeholder: '8' }),
        React.createElement(NameRow, null),
        React.createElement(
          'div',
          {
            className: 'form-tips',
            id: 'node-div-formTipRow' },
          React.createElement(
            'b',
            null,
            'Note:'
          ),
          ' The Pin number is not required when using an I2C backpack.'
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
          'Neopixel output node using ',
          React.createElement(
            'a',
            { href: 'https://github.com/ajfisher/node-pixel', target: '_blank' },
            'node-pixel'
          ),
          '. '
        ),
        React.createElement(
          'p',
          null,
          'A msg can be sent to set an entire strip a single color. Example: ',
          React.createElement(
            'code',
            null,
            '{payload: \'#FF0000\'})'
          ),
          ' OR ',
          React.createElement(
            'code',
            null,
            '{payload: {strip: \'#FF0000\'}})'
          )
        ),
        React.createElement(
          'p',
          null,
          'You can also use an object to specify a single pixel in the array by id. Example: ',
          React.createElement(
            'code',
            null,
            '{payload: {color: \'blue\', id: 3}})'
          )
        ),
        React.createElement(
          'p',
          null,
          'A msg can be sent to shift pixels over. Example shift backwards 2 spaces and wrap: ',
          React.createElement(
            'code',
            null,
            '{payload: {shift: 2, backward: true, wrap: true}})'
          )
        ),
        React.createElement(
          'p',
          null,
          'An array of commands can be supplied and executed in order. Example: ',
          React.createElement(
            'code',
            null,
            '{payload: [{strip: \'black\'},{color: \'red\', id:5},{color: \'#00f600\', id: 0},{shift: 1}})'
          )
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'NeoPixel (node-pixel) Output node.'
      );
    }
  });

  PN.nodes.registerType('servo', {
    category: 'robotics',
    defaults: {
      name: { value: "", required: false },
      pin: { value: "", required: true },
      upperRange: { value: "", required: false },
      lowerRange: { value: "", required: false },
      mode: { value: "standard", required: true },
      controller: { value: "", required: false },
      board: { type: "nodebot", required: true }
    },
    color: "#f6de1d",
    inputs: 1,
    outputs: 0,
    faChar: "&#xf085;", //gears
    faColor: "black",
    align: "right",
    label: function label() {
      return this.name || "servo";
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(TextRow, { name: 'board', icon: 'tasks' }),
        React.createElement(SelectRow, { name: 'mode', icon: 'wrench', options: ['standard', 'continuous'] }),
        React.createElement(TextRow, { name: 'pin', icon: 'neuter', placeholder: '3' }),
        React.createElement(TextRow, { name: 'controller', icon: 'wrench', placeholder: 'PCA9685' }),
        React.createElement(TextRow, { name: 'lowerRange', icon: 'long-arrow-down', placeholder: '0' }),
        React.createElement(TextRow, { name: 'upperRange', icon: 'long-arrow-up', placeholder: '180' }),
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
          'Servo output node using ',
          React.createElement(
            'a',
            { href: 'http://johnny-five.io/api/servo/', target: '_blank' },
            'johnny-five Servo'
          ),
          '. '
        ),
        React.createElement('p', null),
        React.createElement('p', null),
        React.createElement(
          'p',
          null,
          'A ',
          React.createElement(
            'strong',
            null,
            'standard'
          ),
          ' servo can be messaged to sweep back and forth. Example: ',
          React.createElement(
            'code',
            null,
            '{payload: \'sweep\'})'
          )
        ),
        React.createElement(
          'p',
          null,
          'Other string payload command values are ',
          React.createElement(
            'code',
            null,
            'stop'
          ),
          ', ',
          React.createElement(
            'code',
            null,
            'home'
          ),
          ', ',
          React.createElement(
            'code',
            null,
            'min'
          ),
          ', ',
          React.createElement(
            'code',
            null,
            'max'
          ),
          ', and ',
          React.createElement(
            'code',
            null,
            'center'
          ),
          ' '
        ),
        React.createElement(
          'p',
          null,
          'You can also set an angle value in the payload. Example: ',
          React.createElement(
            'code',
            null,
            '{payload: 90})'
          ),
          ' OR with timing : ',
          React.createElement(
            'code',
            null,
            '{payload: 90, duration: 500, steps: 10})'
          ),
          ' '
        ),
        React.createElement('p', null),
        React.createElement('p', null),
        React.createElement(
          'p',
          null,
          'A ',
          React.createElement(
            'strong',
            null,
            'continuous'
          ),
          ' servo can be given a speed from 0 to 1. Example: ',
          React.createElement(
            'code',
            null,
            '{payload: 0.25})'
          ),
          ' OR to move counter-clockwise:',
          React.createElement(
            'code',
            null,
            '{payload: 0.25, ccw: true})'
          )
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Servo Output node.'
      );
    }
  });

  PN.nodes.registerType('node-led', {
    category: 'robotics',
    defaults: {
      name: { value: "", required: false },
      address: { value: "112", required: true },
      mode: { value: "AlphaNum4", required: true },
      board: { type: "nodebot", required: true }
    },
    color: "#f6de1d",
    inputs: 1,
    outputs: 0,
    faChar: "&#xf185;", //sun-o
    faColor: "black",
    align: "right",
    label: function label() {
      return this.name || "node-led";
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(TextRow, { name: 'board', icon: 'tasks' }),
        React.createElement(SelectRow, { name: 'mode', icon: 'wrench', options: ['AlphaNum4', 'SevenSegment', 'Matrix8x16', 'Matrix8x8'] }),
        React.createElement(TextRow, { name: 'address', icon: 'neuter', placeholder: '112' }),
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
          'Node-led output node using the excellent ',
          React.createElement(
            'a',
            { href: 'https://github.com/louiemontes/node-led', target: '_blank' },
            'louiemontes/node-led'
          ),
          ' library for ',
          React.createElement(
            'a',
            { href: 'https://learn.adafruit.com/adafruit-led-backpack/overview', target: '_blank' },
            'Adafruit LED Backpacks'
          ),
          '. '
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Node-led Output node.'
      );
    }
  });

  PN.nodes.registerType('johnny5', {
    color: "#f6de1d",
    category: 'robotics',
    defaults: {
      name: { value: "" },
      func: { value: "" },
      board: { type: "nodebot", required: true },
      noerr: { value: 0, required: true, validate: function validate(v) {
          return !v || v === 0 ? true : false;
        } }
    },
    inputs: 1,
    outputs: 1,
    faChar: "&#xf135;", //rocket
    faColor: "black",
    label: function label() {
      return this.name || 'johnny5';
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
        height -= parseInt(editorRow.css("marginTop"), 10) + parseInt(editorRow.css("marginBottom"), 10);
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

      this.editor.focus();

      loadExamples(this);
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
      return React.createElement(
        'div',
        null,
        React.createElement(TextRow, { name: 'board', icon: 'tasks' }),
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-name' },
            React.createElement('i', { className: 'fa fa-tag' }),
            React.createElement(
              'span',
              null,
              ' name'
            )
          ),
          React.createElement('input', { type: 'text', id: 'node-input-name', style: { width: '40%' } }),
          React.createElement(
            'a',
            {
              href: '#',
              className: 'btn',
              id: 'node-config-examples',
              style: { float: 'right' } },
            React.createElement('i', { className: 'fa fa-file-o' }),
            ' examples'
          )
        ),
        React.createElement(
          'div',
          {
            className: 'form-row',
            style: { marginBottom: 0 } },
          React.createElement(
            'label',
            { htmlFor: 'node-input-func' },
            React.createElement('i', { className: 'fa fa-wrench' }),
            React.createElement(
              'span',
              null,
              ' onReady'
            )
          ),
          React.createElement('input', {
            type: 'hidden',
            id: 'node-input-func' }),
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
          { className: 'form-tips' },
          React.createElement(
            'span',
            null,
            'See the Info tab for help writing johnny-five functions.'
          )
        ),
        React.createElement(
          'div',
          {
            id: 'examplesListDialog',
            title: 'Code examples',
            className: 'hide' },
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement('select', { id: 'exampleScripts' })
          ),
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement('textarea', { id: 'scriptTextarea', style: { height: '150px', width: '250px' } })
          )
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
          'A function block where you can write code using the amazing ',
          React.createElement(
            'a',
            { target: '_new', href: 'http://johnny-five.io' },
            'johnny-five'
          ),
          ' robotics library.'
        ),
        React.createElement(
          'p',
          null,
          'The function you write is what happens once the specified johnny-five board emits a \'ready\' event.'
        ),
        React.createElement(
          'p',
          null,
          'Your script executes ',
          React.createElement(
            'strong',
            null,
            'ONCE'
          ),
          ' on deployment, ',
          React.createElement(
            'strong',
            null,
            'NOT'
          ),
          ' each time a message comes.'
        ),
        React.createElement(
          'strong',
          null,
          'Using johnny-five components'
        ),
        React.createElement(
          'p',
          null,
          'The "board" and "five" variables are avaiable for use when creating johnny-five component instances such as:'
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'code',
            null,
            'var led = new five.Led(',
            '{pin: 13, board: board}',
            ');'
          )
        ),
        React.createElement(
          'strong',
          null,
          'Handling inputs and outputs'
        ),
        React.createElement(
          'p',
          null,
          'You handle input and output messages to the node in your code with:'
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'code',
            null,
            'node.on("input", function(msg){ ... })'
          ),
          React.createElement('br', null),
          'and ',
          React.createElement('br', null),
          React.createElement(
            'code',
            null,
            'node.send({topic: "myTopic", payload: "myPayload"})'
          )
        ),
        React.createElement(
          'strong',
          null,
          'Using other modules'
        ),
        React.createElement(
          'p',
          null,
          'You have a require function available to your scripts to do things such as:'
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'code',
            null,
            'var _ = require("lodash");'
          )
        ),
        React.createElement('p', null),
        React.createElement(
          'p',
          null,
          'Aside from lodash, a few other libraries are available:'
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
              'node-pixel'
            )
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'code',
              null,
              'oled-js'
            )
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'code',
              null,
              'oled-font-5x7'
            )
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'code',
              null,
              'temporal'
            )
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'code',
              null,
              'tharp'
            )
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'code',
              null,
              'vektor'
            )
          )
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'GPIO Output Node'
      );
    }
  });
};