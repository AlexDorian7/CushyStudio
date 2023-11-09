import React, { useState } from "react";
import { BlocklyWorkspace } from "react-blockly";
import Blockly from "blockly";
import { observer } from "mobx-react-lite";
import { DraftL } from "src/models/Draft";

import "./customBlocks";

//import "./../../schema/blocklySchema";
import { toolBoxCategories } from "./../../schema/blocklySchema";

//const toolBoxCategories = { "kind": "categoryToolbox", "contents": [{ "kind": "category", "name": "Hats", "colour": "40", "contents": [{ "kind": "block", "type": "ui_hat" }, { "kind": "block", "type": "run_hat" }] }, { "kind": "category", "name": "Types", "colour": "225", "contents": [{ "kind": "block", "type": "type_CLIP_VISION_OUTPUT" }, { "kind": "block", "type": "type_BOOLEAN" }, { "kind": "block", "type": "type_CONTROL_NET_STACK" }, { "kind": "block", "type": "type_SRG_STAGE_OUTPUT" }, { "kind": "block", "type": "type_PARAMETER_INPUTS" }, { "kind": "block", "type": "type_STRING" }, { "kind": "block", "type": "type_SRG_PROMPT_TEXT" }, { "kind": "block", "type": "type_SRG_DATA_STREAM" }, { "kind": "block", "type": "type_SRG_STAGE_INPUT" }, { "kind": "block", "type": "type_CHECKPOINT_NAME" }, { "kind": "block", "type": "type_FLOAT" }, { "kind": "block", "type": "type_SCHEDULER_NAME" }, { "kind": "block", "type": "type_MODEL_SETTINGS" }, { "kind": "block", "type": "type_UPSCALE_MODEL" }, { "kind": "block", "type": "type_UPSCALER_NAME" }, { "kind": "block", "type": "type_INT" }, { "kind": "block", "type": "type_CONDITIONING" }, { "kind": "block", "type": "type_COLOR_MATRIX" }, { "kind": "block", "type": "type_PS_PROCESSOR" }, { "kind": "block", "type": "type_IMAGE_INPUTS" }, { "kind": "block", "type": "type_DEPENDENCIES" }, { "kind": "block", "type": "type_SAMPLER_NAME" }, { "kind": "block", "type": "type_ENABLE_STATE" }, { "kind": "block", "type": "type_CLIP_VISION" }, { "kind": "block", "type": "type_STYLE_MODEL" }, { "kind": "block", "type": "type_CONTROL_NET" }, { "kind": "block", "type": "type_TEXT_INPUTS" }, { "kind": "block", "type": "type_SAVE_FOLDER" }, { "kind": "block", "type": "type_MODEL_NAMES" }, { "kind": "block", "type": "type_CLIPREGION" }, { "kind": "block", "type": "type_SDXL_TUPLE" }, { "kind": "block", "type": "type_LORA_STACK" }, { "kind": "block", "type": "type_PARAMETERS" }, { "kind": "block", "type": "type_LORA_NAME" }, { "kind": "block", "type": "type_PS_MODEL" }, { "kind": "block", "type": "type_VAE_NAME" }, { "kind": "block", "type": "type_SAMPLER" }, { "kind": "block", "type": "type_LATENT" }, { "kind": "block", "type": "type_GLIGEN" }, { "kind": "block", "type": "type_SIGMAS" }, { "kind": "block", "type": "type_SCRIPT" }, { "kind": "block", "type": "type_MODEL" }, { "kind": "block", "type": "type_IMAGE" }, { "kind": "block", "type": "type_$Star" }, { "kind": "block", "type": "type_TUPLE" }, { "kind": "block", "type": "type_CLIP" }, { "kind": "block", "type": "type_MASK" }, { "kind": "block", "type": "type_VAE" }, { "kind": "block", "type": "type_XY" }] }, { "kind": "category", "name": "UI", "colour": "90", "contents": [{ "kind": "block", "type": "ui_param" }, { "kind": "block", "type": "ui_define" }] }, { "kind": "category", "name": "Logic", "colour": "#5C81A6", "contents": [{ "kind": "block", "type": "controls_if" }, { "kind": "block", "type": "logic_compare" }] }, { "kind": "category", "name": "Math", "colour": "#5CA65C", "contents": [{ "kind": "block", "type": "math_round" }, { "kind": "block", "type": "math_number" }] }, { "kind": "category", "name": "Functions", "colour": "#7F00FF", "custom": "PROCEDURE" }] };


export const BlocklyDraftWidget = observer(function _BlocklyDraftWidget(p: { draft: DraftL }) {
    const [xml, setXml] = useState("");
    const [workspace, setWorkspace] = useState({} as Blockly.WorkspaceSvg);
    //setXml('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="text" x="60" y="40"><field name="TEXT"></field></block></xml>');
    return (
        <div tw="h-full w-full"
            onResize={() => { Blockly.svgResize(workspace) }} // The Blockly UI does not handle being resized very well
        >
            <BlocklyWorkspace
                tw="h-full w-full"

                toolboxConfiguration={toolBoxCategories}
                initialXml={xml}
                workspaceConfiguration={{
                    grid: {
                        spacing: 20,
                        length: 3,
                        colour: "#ccc",
                        snap: true
                    }

                }}
                onXmlChange={setXml}
                onWorkspaceChange={setWorkspace}

            />
            <textarea id="blockly-code" style={{ display: "none" }} readOnly></textarea>
            <textarea id="blockly-xml" style={{ display: "none" }} readOnly>{xml}</textarea>
        </div>
    );
});