import * as vscode from 'vscode'
import type { FlowRun } from '../core-back/FlowRun'
import type { ComfyPromptJSON } from '../core-types/ComfyPrompt'
import type { WsMsgExecuted, WsMsgExecuting } from '../core-types/ComfyWsPayloads'
import type { ScriptStep_Iface } from './ScriptStep_Iface'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { GeneratedImage } from '../core-back/GeneratedImage'
import { Graph } from '../core-shared/Graph'
import { deepCopyNaive } from '../utils/ComfyUtils'

export class PromptExecution implements ScriptStep_Iface<PromptExecution> {
    private static promptID = 1

    /** unique step id */
    uid = nanoid()

    /** human-readable step name */
    name = 'prompt-' + PromptExecution.promptID++

    /** deepcopy of run graph at creation time; ready to be forked */
    _graph: Graph

    /** short-hand getter to access parent client */
    get workspace(){ return this.run.workspace } // prettier-ignore

    constructor(
        //
        public run: FlowRun,
        public prompt: ComfyPromptJSON,
    ) {
        this._graph = new Graph(
            //
            this.run.workspace.schema,
            // this.run,
            deepCopyNaive(prompt),
        )
        makeAutoObservable(this)
    }

    _resolve!: (value: this) => void
    _rejects!: (reason: any) => void
    finished: Promise<this> = new Promise((resolve, rejects) => {
        this._resolve = resolve
        this._rejects = rejects
    })

    /** pointer to the currently executing node */
    // currentExecutingNode: ComfyNode<any> | null = null

    /** update the progress value of the currently focused onde */
    // onProgress = (msg: WsMsgProgress) => {
    //     if (this.currentExecutingNode) {
    //         this.currentExecutingNode.progress = msg.data
    //     } else {
    //         console.log('❌ no current executing node', msg)
    //     }
    // }

    notifyEmptyPrompt = () => vscode.window.showWarningMessage('No work to do')

    /** update pointer to the currently executing node */
    onExecuting = (msg: WsMsgExecuting) => {
        this._graph.onExecuting(msg)
        if (msg.data.node == null) {
            this._finish()
            return
        }
        // {
        //    console.log(`executing "null" node => prompt is done`)
        //    2023-03-18 rvion: if I understand correctly, null here means there is no work to do.
        //    2023-03-21 rvion: actually, it probably means the prompt is done
        //    if (this.currentExecutingNode == null) this.notifyEmptyPrompt() 🔴 add back ?
        //    else this.currentExecutingNode.status = 'done'
        //    return
        // }

        // 🔴 const node = this._graph.getNodeOrCrash(msg.data.node)
        // 🔴 if (this.currentExecutingNode) this.currentExecutingNode.status = 'done'
        // 🔴 this.currentExecutingNode = node
        // 🔴 node.status = 'executing'
    }

    /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
    private outputs: WsMsgExecuted[] = []
    images: GeneratedImage[] = []

    /** udpate execution list */
    onExecuted = (msg: WsMsgExecuted): GeneratedImage[] => {
        const node = this._graph.getNodeOrCrash(msg.data.node)
        const images = msg.data.output.images.map((i) => new GeneratedImage(this, i))
        this.outputs.push(msg) // accumulate in self
        this.images.push(...images)
        node.artifacts.push(msg.data) // accumulate in node
        this.run.generatedImages.push(...images)
        // console.log(`🟢 graph(${this._graph.uid}) => node(${node.uid}) => (${node.artifacts.length} images)`)
        return images
    }

    /** finish this step */
    private _finish = () => {
        if (this._resolve == null) throw new Error('❌ invariant violation: ScriptStep_prompt.resolve is null.')
        this._resolve(this)
    }
}
