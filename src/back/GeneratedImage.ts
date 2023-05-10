import type { PromptExecution } from '../controls/ScriptStep_prompt'
import type { ComfyImageInfo } from '../types/ComfyWsPayloads'
import type { Maybe } from '../utils/types'
import type { ServerState } from './ServerState'

import fetch from 'node-fetch'
import * as path from 'path'
import { ImageInfos } from '../core/GeneratedImageSummary'
import { logger } from '../logger/logger'
import { AbsolutePath, RelativePath } from '../utils/fs/BrandedPaths'
import { asRelativePath } from '../utils/fs/pathUtils'

enum ImageStatus {
    Known = 1,
    Downloading = 2,
    Saved = 3,
}
/** Cushy wrapper around ComfyImageInfo */
export class GeneratedImage implements ImageInfos {
    private static imageID = 1
    private workspace: ServerState

    convertToImageInput = (): string => {
        return `../outputs/${this.data.filename}`
        // return this.LoadImage({ image: name })
    }

    uid: string
    constructor(
        /** the prompt this file has been generated from */
        public prompt: PromptExecution,
        /** image info as returned by Comfy */
        public data: ComfyImageInfo, // public uid: string,
    ) {
        this.uid = `${this.prompt.name}_${GeneratedImage.imageID++}`
        this.workspace = prompt.workspace
        this.ready = this.downloadImageAndSaveToDisk()
    }

    /** unique image id */

    // high level API ----------------------------------------------------------------------
    /** run an imagemagick convert action */
    imagemagicConvert = (partialCmd: string, suffix: string): string => {
        const pathA = this.localRelativeFilePath
        const pathB = `${pathA}.${suffix}.png`
        const cmd = `convert "${pathA}" ${partialCmd} "${pathB}"`
        this.prompt.run.exec(cmd)
        return pathB
    }

    // COMFY RELATIVE ----------------------------------------------------------------------
    /** file name within the ComfyUI folder */
    get comfyFilename() { return this.data.filename } // prettier-ignore

    /** relative path on the comfy URL */
    get comfyRelativePath(): string { return `./outputs/${this.data.filename}` } // prettier-ignore

    /** url to acces the image */
    get comfyURL():string { return this.workspace.getServerHostHTTP() + '/view?' + new URLSearchParams(this.data).toString() } // prettier-ignore

    /** path within the input folder */
    comfyInputPath?: Maybe<string> = null

    // CUSHY RELATIVE ----------------------------------------------------------------------

    /** local workspace file name, without extension */
    get localFileNameNoExt(): string { return this.prompt.uid + '_' + this.uid } // prettier-ignore

    /** local workspace file name, WITH extension */
    get localFileName(): string { return this.localFileNameNoExt + '.png' } // prettier-ignore

    /** local workspace relative file path */
    get localRelativeFilePath(): RelativePath { return asRelativePath(this.localFolder + path.sep + this.localFileName) } // prettier-ignore

    /** absolute path on the machine with vscode */
    get localAbsoluteFilePath(): AbsolutePath { return this.workspace.resolve(this.localRelativeFilePath) } // prettier-ignore

    // .cushy/cache/Run-20230501220410/FaxYjyW1-fLr8ovwECJzZ_prompt-4_21.png
    // http://127.0.0.1:8288/Run-20230501220410/FaxYjyW1-fLr8ovwECJzZ_prompt-4_19.png
    get localExtensionURL(): string {
        return this.workspace.server.baseURL + this.localRelativeFilePath.replace(this.workspace.cacheFolderPath, '')
    }

    toJSON = (): ImageInfos => {
        return {
            uid: this.uid,
            comfyRelativePath: this.comfyRelativePath,
            localRelativeFilePath: this.localRelativeFilePath,
            localAbsoluteFilePath: this.localAbsoluteFilePath,
            comfyURL: this.comfyURL,
        }
    }
    // MISC ----------------------------------------------------------------------
    /** true if file exists on disk; false otherwise */
    status: ImageStatus = ImageStatus.Known
    ready: Promise<true>

    /** @internal */
    private downloadImageAndSaveToDisk = async (): Promise<true> => {
        if (this.status !== ImageStatus.Known) throw new Error(`image status is ${this.status}`)
        this.status = ImageStatus.Downloading
        const response = await fetch(this.comfyURL, {
            headers: { 'Content-Type': 'image/png' },
            method: 'GET',
            // responseType: ResponseType.Binary,
        })
        const binArr = await response.buffer()
        // const binArr = new Uint16Array(numArr)

        this.workspace.writeBinaryFile(this.localAbsoluteFilePath, binArr)
        logger().info('🖼️ image saved')
        this.status = ImageStatus.Saved
        return true
    }

    /** this is such a bad workaround but 🤷‍♂️ */
    uploadAsNamedInput = async (): Promise<string> => {
        const res = await this.prompt.run.uploadURL(this.comfyURL)
        console.log(`[makeAvailableAsInput]`, res)
        this.comfyInputPath = res.name
        return res.name
    }
}
