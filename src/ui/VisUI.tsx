import type { Edge, Node, Options } from 'vis-network/declarations/network/Network'

import { observer } from 'mobx-react-lite'
import { useLayoutEffect } from 'react'
import { useSt } from './stContext'

import * as visData from 'vis-data'
import * as visNetwork from 'vis-network'

export type VisNodes = Node // { id: string; label: string; color?: string; font?: { color: string } }
export type VisEdges = Edge // { id: string; from: string; to: string }
export type VisOptions = Options

export const VisUI = observer(function VisUI_(p: {}) {
    const st = useSt()
    const visJSON = st.project.currentRun?.graph?.JSON_forVisDataVisualisation
    useLayoutEffect(() => {
        if (visJSON == null) return
        var nodes = new visData.DataSet(visJSON.nodes)
        var edges = new visData.DataSet(visJSON.edges)
        var container = document.getElementById('mynetwork')!
        if (container == null) return console.log('container is null')
        var data = {
            nodes: nodes,
            edges: edges,
        }
        // https://visjs.github.io/vis-network/docs/network/layout.html
        var options: VisOptions = {
            layout: {
                improvedLayout: true,
                hierarchical: {
                    sortMethod: 'directed',
                    shakeTowards: 'leaves',
                    direction: 'LR',
                    // parentCentralization: false,
                },
            },
        }
        var network = new visNetwork.Network(container, data, options)
        return
    }, [visJSON])
    return <div style={{ height: '100%' }} id='mynetwork' />
})
