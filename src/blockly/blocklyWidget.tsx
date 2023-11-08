import React, { useState } from "react";
import { BlocklyWorkspace } from "react-blockly";
import Blockly from "blockly";
import { observer } from "mobx-react-lite";
import { DraftL } from "src/models/Draft";

import "./customBlocks";

const toolboxCategories = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Hats",
      colour: "40",
      contents: [
        {
          kind: "block",
          type: "ui_hat",
        },
        {
          kind: "block",
          type: "run_hat",
        },
      ],
    },
    {
      kind: "category",
      name: "UI",
      colour: "90",
      contents: [
        {
          kind: "block",
          type: "ui_param",
        },
      ],
    },
    {
      kind: "category",
      name: "Logic",
      colour: "#5C81A6",
      contents: [
        {
          kind: "block",
          type: "controls_if",
        },
        {
          kind: "block",
          type: "logic_compare",
        },
      ],
    },
    {
      kind: "category",
      name: "Math",
      colour: "#5CA65C",
      contents: [
        {
          kind: "block",
          type: "math_round",
        },
        {
          kind: "block",
          type: "math_number",
        },
      ],
    },
    {
      "kind": "category",
      "name": "Functions",
      "colour": "#7F00FF",
      "custom": "PROCEDURE"
    }
  ],
};

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

        toolboxConfiguration={toolboxCategories}
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