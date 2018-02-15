module.exports = function(PN){

  PN.nodes.registerType('math',{
    category: 'function',      // the palette category
    color:"#778899", //light gray
    defaults: {             // defines the editable properties of the node
      name: {value:""},   //  along with default values.
      operator: {value:"+", required:true},
      operand: {value:"", required:false},
      operandType: {value:"num", required:false},
      payload: {value:"payload", required:false},
      result: {value:"payload", required:false},
      payloadType: {value:"msg", required:false},
      resultType: {value:"msg", required:false}
    },
    inputs:1,   // set the number of inputs - only 0 or 1
    outputs:1,  // set the number of outputs - 0 to n
    faChar: "&#xf1ec;",  //calculator
    label: function() {
      return this.name|| this.operator + ' ' + (this.operand || '');
    },
    oneditprepare: function() {
      PN.util.setupTypedText({name: 'payload', node: this, types: ['msg','flow','num','str']});
      PN.util.setupTypedText({name: 'result', node: this, types: ['msg','flow']});
      PN.util.setupTypedText({name: 'operand', node: this, types: ['num','msg','flow','str']});
    },
    render: function (){
      const {NameRow, TypeTextRow, SelectRow, ResultRow} = PN.components;
      return (
        <div>
          <div className="form-row">
            <label htmlFor="node-input-operator"><i className="fa fa-tasks"></i> <span>Operator</span></label>
            <select id="node-input-operator">

              // General options
              <option value="+">x + y</option>
              <option value="-">x - y</option>
              <option value="*">x * y</option>
              <option value="/">x / y</option>
              <option value="%">x modulo y</option>
              <option value="^">x^y</option>
              <option value="log">log_x_(y)</option>
              <option value="round">round x</option>

              // Special rounding options
              <option value="floor">floor of x</option>
              <option value="ceil">ceiling of x</option>

              // Trig Options
              <option value="sin">sin(x)</option>
              <option value="cos">cos(x)</option>
              <option value="tan">tan(x)</option>
              <option value="csc">csc(x)</option>
              <option value="sec">sec(x)</option>
              <option value="cot">cot(x)</option>

              // Reverse (r) applicable options
              <option value="-r">y - x</option>
              <option value="/r">y / x</option>
              <option value="%r">y modulo x</option>
              <option value="^r">y^x</option>
              <option value="logr">log_y_(x)</option>
              <option value="roundr">round y</option>
              <option value="floorr">floor of y</option>
              <option value="ceilr">ceiling of y</option>
              <option value="sinr">sin(y)</option>
              <option value="cosr">cos(y)</option>
              <option value="tanr">tan(y)</option>
              <option value="cscr">csc(y)</option>
              <option value="secr">sec(y)</option>
              <option value="cotr">cot(y)</option>

              // bitwise operators
              <option value="AND">x AND y</option>
              <option value="OR">x OR y</option>
              <option value="XOR">x XOR y</option>
              <option value="NOT">NOT x</option>
              <option value="<<">x &lt;&lt; y</option>
              <option value=">>">x &gt;&gt; y</option>

              //trash
              <option value="concat">string concat</option>

            </select>
          </div>

          <TypeTextRow name="payload" label="x" icon="cogs"/>

          <TypeTextRow name="operand" label="y" icon="cogs" placeholder="Enter a number, 'pi', or 'e'"/>

          <ResultRow/>

          <NameRow/>

          <div className="form-tips">
            <span>
              The <code>x</code> value and <code>result</code> value will default to the <code>msg.payload</code> property if not specified.
            </span>
          </div>

        </div>
      )
    },
    renderHelp: function () {
      return (
        <div>
          <p>Allows various math operations that alter <code>msg.payload</code>.</p>
          <p>The y value (or operand) can be stated in the node or, if left blank, can be set
            by <code>msg.operand</code>.</p>
          <p>Likewise the radix for parsing the operand
            and payload can be set by <code>msg.radix</code>,
            or if not set will default to base ten.</p>
        </div>
      )
    },
    renderDescription: () => <p>Preforms various math operations</p>
  });


};
