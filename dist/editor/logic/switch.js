'use strict';

module.exports = function (PN) {
    PN.nodes.registerType('switch', {
        color: "#E2D96E",
        category: 'function',
        defaults: {
            name: { value: "" },
            property: { value: "payload", required: true },
            propertyType: { value: "msg" },
            rules: { value: [{ t: "eq", v: "" }] },
            checkall: { value: "true", required: true },
            outputs: { value: 1 }
        },
        inputs: 1,
        outputs: 1,
        faChar: "&#xf126;", //code-fork
        label: function label() {
            return this.name || "switch";
        },
        oneditprepare: function oneditprepare() {
            var node = this;
            var previousValueType = { value: "prev", label: this._("inject.previous"), hasValue: false };

            $("#node-input-property").typedInput({ default: this.propertyType || 'msg', types: ['msg'] });
            var operators = [{ v: "eq", t: "==" }, { v: "neq", t: "!=" }, { v: "lt", t: "<" }, { v: "lte", t: "<=" }, { v: "gt", t: ">" }, { v: "gte", t: ">=" }, { v: "btwn", t: this._("switch.rules.btwn") }, { v: "cont", t: this._("switch.rules.cont") }, { v: "regex", t: this._("switch.rules.regex") }, { v: "true", t: this._("switch.rules.true") }, { v: "false", t: this._("switch.rules.false") }, { v: "null", t: this._("switch.rules.null") }, { v: "nnull", t: this._("switch.rules.nnull") }, { v: "else", t: this._("switch.rules.else") }];

            var andLabel = this._("switch.and");
            var caseLabel = this._("switch.ignorecase");

            function resizeRule(rule) {
                var newWidth = rule.width();
                var selectField = rule.find("select");
                var type = selectField.val() || "";
                var valueField = rule.find(".node-input-rule-value");
                var btwnField1 = rule.find(".node-input-rule-btwn-value");
                var btwnField2 = rule.find(".node-input-rule-btwn-value2");
                var selectWidth;
                if (type.length < 4) {
                    selectWidth = 60;
                } else if (type === "regex") {
                    selectWidth = 147;
                } else {
                    selectWidth = 120;
                }
                selectField.width(selectWidth);
                if (type === "btwn") {
                    btwnField1.typedInput("width", newWidth - selectWidth - 70);
                    btwnField2.typedInput("width", newWidth - selectWidth - 70);
                } else {
                    if (type === "true" || type === "false" || type === "null" || type === "nnull" || type === "else") {
                        // valueField.hide();
                    } else {
                        valueField.typedInput("width", newWidth - selectWidth - 70);
                    }
                }
            }

            $("#node-input-rule-container").css('min-height', '250px').css('min-width', '450px').editableList({
                addItem: function addItem(container, i, opt) {
                    var rule = opt;
                    if (!rule.hasOwnProperty('t')) {
                        rule.t = 'eq';
                    }
                    var row = $('<div/>').appendTo(container);
                    var row2 = $('<div/>', { style: "padding-top: 5px; padding-left: 175px;" }).appendTo(container);
                    var row3 = $('<div/>', { style: "padding-top: 5px; padding-left: 102px;" }).appendTo(container);
                    var selectField = $('<select/>', { style: "width:120px; margin-left: 5px; text-align: center;" }).appendTo(row);
                    for (var d in operators) {
                        selectField.append($("<option></option>").val(operators[d].v).text(operators[d].t));
                    }
                    var valueField = $('<input/>', { class: "node-input-rule-value", type: "text", style: "margin-left: 5px;" }).appendTo(row).typedInput({ default: 'str', types: ['msg', 'str', 'num', previousValueType] });
                    var btwnValueField = $('<input/>', { class: "node-input-rule-btwn-value", type: "text", style: "margin-left: 5px;" }).appendTo(row).typedInput({ default: 'num', types: ['msg', 'str', 'num', previousValueType] });
                    var btwnAndLabel = $('<span/>', { class: "node-input-rule-btwn-label" }).text(" " + andLabel + " ").appendTo(row3);
                    var btwnValue2Field = $('<input/>', { class: "node-input-rule-btwn-value2", type: "text", style: "margin-left:2px;" }).appendTo(row3).typedInput({ default: 'num', types: ['msg', 'str', 'num', previousValueType] });
                    var finalspan = $('<span/>', { style: "float: right;margin-top: 6px;" }).appendTo(row);
                    finalspan.append(' &#8594; <span class="node-input-rule-index">' + (i + 1) + '</span> ');
                    var caseSensitive = $('<input/>', { id: "node-input-rule-case-" + i, class: "node-input-rule-case", type: "checkbox", style: "width:auto;vertical-align:top" }).appendTo(row2);
                    $('<label/>', { for: "node-input-rule-case-" + i, style: "margin-left: 3px;" }).text(caseLabel).appendTo(row2);
                    selectField.change(function () {
                        resizeRule(container);
                        var type = selectField.val();
                        if (type === "btwn") {
                            valueField.typedInput('hide');
                            btwnValueField.typedInput('show');
                        } else {
                            btwnValueField.typedInput('hide');
                            if (type === "true" || type === "false" || type === "null" || type === "nnull" || type === "else") {
                                valueField.typedInput('hide');
                            } else {
                                valueField.typedInput('show');
                            }
                        }
                        if (type === "regex") {
                            row2.show();
                            row3.hide();
                        } else if (type === "btwn") {
                            row2.hide();
                            row3.show();
                        } else {
                            row2.hide();
                            row3.hide();
                        }
                    });
                    selectField.val(rule.t);
                    if (rule.t == "btwn") {
                        btwnValueField.typedInput('value', rule.v);
                        btwnValueField.typedInput('type', rule.vt || 'num');
                        btwnValue2Field.typedInput('value', rule.v2);
                        btwnValue2Field.typedInput('type', rule.v2t || 'num');
                    } else if (typeof rule.v != "undefined") {
                        valueField.typedInput('value', rule.v);
                        valueField.typedInput('type', rule.vt || 'str');
                    }
                    if (rule.case) {
                        caseSensitive.prop('checked', true);
                    } else {
                        caseSensitive.prop('checked', false);
                    }
                    selectField.change();
                },
                removeItem: function removeItem(opt) {
                    var rules = $("#node-input-rule-container").editableList('items');
                    rules.each(function (i) {
                        $(this).find(".node-input-rule-index").html(i + 1);
                    });
                },
                resizeItem: resizeRule,
                sortItems: function sortItems(rules) {
                    var rules = $("#node-input-rule-container").editableList('items');
                    rules.each(function (i) {
                        $(this).find(".node-input-rule-index").html(i + 1);
                    });
                },
                sortable: true,
                removable: true
            });

            for (var i = 0; i < this.rules.length; i++) {
                var rule = this.rules[i];
                $("#node-input-rule-container").editableList('addItem', rule);
            }
        },
        oneditsave: function oneditsave() {
            var rules = $("#node-input-rule-container").editableList('items');
            var ruleset;
            var node = this;
            node.rules = [];
            rules.each(function (i) {
                var rule = $(this);
                var type = rule.find("select").val();
                var r = { t: type };
                if (!(type === "true" || type === "false" || type === "null" || type === "nnull" || type === "else")) {
                    if (type === "btwn") {
                        r.v = rule.find(".node-input-rule-btwn-value").typedInput('value');
                        r.vt = rule.find(".node-input-rule-btwn-value").typedInput('type');
                        r.v2 = rule.find(".node-input-rule-btwn-value2").typedInput('value');
                        r.v2t = rule.find(".node-input-rule-btwn-value2").typedInput('type');
                    } else {
                        r.v = rule.find(".node-input-rule-value").typedInput('value');
                        r.vt = rule.find(".node-input-rule-value").typedInput('type');
                    }
                    if (type === "regex") {
                        r.case = rule.find(".node-input-rule-case").prop("checked");
                    }
                }
                node.rules.push(r);
            });
            this.outputs = node.rules.length;
            this.propertyType = $("#node-input-property").typedInput('type');
        },
        oneditresize: function oneditresize(size) {
            var rows = $("#dialog-form>div:not(.node-input-rule-container-row)");
            var height = size.height;
            for (var i = 0; i < rows.size(); i++) {
                height -= $(rows[i]).outerHeight(true);
            }
            var editorRow = $("#dialog-form>div.node-input-rule-container-row");
            height -= parseInt(editorRow.css("marginTop"), 10) + parseInt(editorRow.css("marginBottom"), 10);
            $("#node-input-rule-container").editableList('height', height);
        },
        render: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: 'form-row' },
                    React.createElement(
                        'label',
                        { htmlFor: 'node-input-name' },
                        React.createElement('i', { className: 'fa fa-tag' }),
                        ' ',
                        React.createElement('span', { 'data-i18n': 'common.label.name' })
                    ),
                    React.createElement('input', { type: 'text', id: 'node-input-name', 'data-i18n': '[placeholder]common.label.name' })
                ),
                React.createElement(
                    'div',
                    { className: 'form-row' },
                    React.createElement('label', { 'data-i18n': 'switch.label.property' }),
                    React.createElement('input', { type: 'text', id: 'node-input-property', style: { width: "70%" } })
                ),
                React.createElement(
                    'div',
                    { className: 'form-row node-input-rule-container-row' },
                    React.createElement('ol', { id: 'node-input-rule-container' })
                ),
                React.createElement(
                    'div',
                    { className: 'form-row' },
                    React.createElement(
                        'select',
                        { id: 'node-input-checkall', style: { width: "100%", marginRight: "5px" } },
                        React.createElement('option', { value: 'true', 'data-i18n': 'switch.checkall' }),
                        React.createElement('option', { value: 'false', 'data-i18n': 'switch.stopfirst' })
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
                    'A simple function node to route messages based on its properties.'
                ),
                React.createElement(
                    'p',
                    null,
                    'When a message arrives, the selected property is evaluated against each of the defined rules. The message is then sent to the output of ',
                    React.createElement(
                        'i',
                        null,
                        'all'
                    ),
                    'rules that pass.'
                ),
                React.createElement(
                    'p',
                    null,
                    'Note: the ',
                    React.createElement(
                        'i',
                        null,
                        'otherwise'
                    ),
                    ' rule applies as a "not any of" the rules preceding it.'
                )
            );
        },
        renderDescription: function renderDescription() {
            return React.createElement(
                'p',
                null,
                'Route messages based off properties'
            );
        }
    });
};