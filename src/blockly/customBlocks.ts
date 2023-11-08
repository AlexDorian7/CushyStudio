import Blockly from 'blockly';
import javascript from 'blockly/javascript';

// Define blocks

Blockly.Blocks['ui_hat'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("UI");
        this.setNextStatement(true, "ui_factory");
        this.setColour(60);
    this.setTooltip("UI Hat Block");
    this.setHelpUrl("");
    }
};

Blockly.Blocks['run_hat'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("RUN");
    this.setNextStatement(true, "run");
    this.setColour(60);
 this.setTooltip("Run Hat Block");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['ui_param'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("UI Parameter");
    this.appendDummyInput()
        .appendField("Type:")
        .appendField(new Blockly.FieldDropdown([["String","string"], ["Boolean","boolean"], ["Number","number"]]), "type");
    this.appendValueInput("NAME")
        .setCheck("String")
        .appendField("Name:");
    this.setPreviousStatement(true, "ui_factory");
    this.setNextStatement(true, "ui_factory");
    this.setColour(90);
 this.setTooltip("UI Parameter");
 this.setHelpUrl("");
  }
};

// Define block generators

javascript.javascriptGenerator.forBlock['ui_hat'] = function(block, generator) {
  // TODO: Assemble javascript into code variable.
  var code = '...\n';
  return code;
};

javascript.javascriptGenerator.forBlock['run_hat'] = function(block, generator) {
  // TODO: Assemble javascript into code variable.
  var code = '...\n';
  return code;
};

javascript.javascriptGenerator.forBlock['ui_param'] = function(block, generator) {
  var dropdown_type = block.getFieldValue('type');
  var value_name = generator.valueToCode(block, 'NAME', javascript.Order.ATOMIC);
  // TODO: Assemble javascript into code variable.
  var code = '...\n';
  return code;
};