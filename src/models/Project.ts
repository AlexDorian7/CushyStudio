import type { LiveInstance } from '../db/LiveInstance'
import type { GraphID, GraphL } from './Graph'

import { LiveRef } from '../db/LiveRef'
import { ToolID, ToolL } from './Tool'
import { LiveRefOpt } from '../db/LiveRefOpt'

export type ProjectID = Branded<string, 'ProjectID'>
export const asProjectID = (s: string): ProjectID => s as any

export type ProjectT = {
    id: ProjectID
    createdAt: number
    updatedAt: number
    name: string
    rootGraphID: GraphID
    activeToolID?: ToolID
    // currentToolID
    // rootStepID: StepID
}

/** a thin wrapper around a single Project somewhere in a .ts file */
export interface ProjectL extends LiveInstance<ProjectT, ProjectL> {}
export class ProjectL {
    rootGraph = new LiveRef<this, GraphL>(this, 'rootGraphID', 'graphs')

    // _config
    // getConfig() {}
    activeTool = new LiveRefOpt<this, ToolL>(this, 'activeToolID', 'tools')

    get schema() {
        return this.db.schema
    }
}

// ------------
// Project config is stored outside of the DB for practical reasons

type ProjectConfig = {
    comfyURL?: Maybe<string>
}
