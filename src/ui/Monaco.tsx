import { ITextModel, Monaco, TypescriptOptions } from './TypescriptOptions'

import { loader } from '@monaco-editor/react'
import { logger } from '../logger/Logger'

import * as monaco from 'monaco-editor'

// @ts-ignore
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'

// @ts-ignore
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

import { makeAutoObservable } from 'mobx'

export class LocoMonaco {
    constructor() {
        self.MonacoEnvironment = {
            getWorker(_, label) {
                // if (label === 'json') return new jsonWorker()
                // if (label === 'css' || label === 'scss' || label === 'less') return new cssWorker()
                // if (label === 'html' || label === 'handlebars' || label === 'razor') return new htmlWorker()
                if (label === 'typescript' || label === 'javascript') return new tsWorker()

                return new editorWorker()
            },
        }

        loader.config({
            // load monaco from the cdn
            monaco,
            // paths: tsWorker, //: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs' },
        })

        loader.init().then((monaco) => {
            logger.info(`👁️`, `monaco ready`)
            const compilerOptions: TypescriptOptions = {
                strict: true,
                module: monaco.languages.typescript.ModuleKind.ESNext,
                target: monaco.languages.typescript.ScriptTarget.ESNext,
                moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            }
            monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions)
            logger.info(`👁️`, `typescript ready (${monaco.languages.typescript.typescriptVersion})`)
            this._setGlobalMonaco(monaco)
            this.ready = true
        })

        makeAutoObservable(this)
    }

    ready: boolean = false

    private _setGlobalMonaco!: (monaco: Monaco) => void
    promise = new Promise<Monaco>((resove, _rejects) => {
        this._setGlobalMonaco = resove
    })

    convertToJS = async (model: ITextModel): Promise<string> => {
        if (monaco == null) {
            console.log(`[👁] monaco is null`)
            return 'ERROR'
        }
        const workerFn = await monaco.languages.typescript.getTypeScriptWorker()
        const worker = await workerFn(model.uri)
        const result = await worker.getEmitOutput(model.uri.toString())
        const jsCode = result.outputFiles[0]?.text
        if (jsCode == null) return 'ERROR'
        return jsCode.replace('"use strict";', '')
    }
}

export const globalMonaco = new LocoMonaco()
