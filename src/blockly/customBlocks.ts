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
        this.appendValueInput("TYPE")
            .setCheck("type")
            .appendField("Type:");
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

Blockly.Blocks['ui_define'] = {init:function() { this.appendDummyInput().appendField("UI Parameter"); this.appendDummyInput().appendField("Type:").appendField(new Blockly.FieldDropdown([["CLIP_VISION_OUTPUT","CLIP_VISION_OUTPUT"],["BOOLEAN","BOOLEAN"],["CONTROL_NET_STACK","CONTROL_NET_STACK"],["SRG_STAGE_OUTPUT","SRG_STAGE_OUTPUT"],["PARAMETER_INPUTS","PARAMETER_INPUTS"],["STRING","STRING"],["SRG_PROMPT_TEXT","SRG_PROMPT_TEXT"],["SRG_DATA_STREAM","SRG_DATA_STREAM"],["SRG_STAGE_INPUT","SRG_STAGE_INPUT"],["CHECKPOINT_NAME","CHECKPOINT_NAME"],["FLOAT","FLOAT"],["SCHEDULER_NAME","SCHEDULER_NAME"],["MODEL_SETTINGS","MODEL_SETTINGS"],["UPSCALE_MODEL","UPSCALE_MODEL"],["UPSCALER_NAME","UPSCALER_NAME"],["INT","INT"],["CONDITIONING","CONDITIONING"],["COLOR_MATRIX","COLOR_MATRIX"],["PS_PROCESSOR","PS_PROCESSOR"],["IMAGE_INPUTS","IMAGE_INPUTS"],["DEPENDENCIES","DEPENDENCIES"],["SAMPLER_NAME","SAMPLER_NAME"],["ENABLE_STATE","ENABLE_STATE"],["CLIP_VISION","CLIP_VISION"],["STYLE_MODEL","STYLE_MODEL"],["CONTROL_NET","CONTROL_NET"],["TEXT_INPUTS","TEXT_INPUTS"],["SAVE_FOLDER","SAVE_FOLDER"],["MODEL_NAMES","MODEL_NAMES"],["CLIPREGION","CLIPREGION"],["SDXL_TUPLE","SDXL_TUPLE"],["LORA_STACK","LORA_STACK"],["PARAMETERS","PARAMETERS"],["LORA_NAME","LORA_NAME"],["PS_MODEL","PS_MODEL"],["VAE_NAME","VAE_NAME"],["SAMPLER","SAMPLER"],["LATENT","LATENT"],["GLIGEN","GLIGEN"],["SIGMAS","SIGMAS"],["SCRIPT","SCRIPT"],["MODEL","MODEL"],["IMAGE","IMAGE"],["$Star","$Star"],["TUPLE","TUPLE"],["CLIP","CLIP"],["MASK","MASK"],["VAE","VAE"],["XY","XY"]]), "Type"); }};


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