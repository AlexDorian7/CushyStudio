import type { STATE } from 'src/state/state'
import type { DraftID } from 'src/models/Draft'

import * as FL from 'flexlayout-react'
import { Actions, IJsonModel, Layout, Model } from 'flexlayout-react'

import { makeAutoObservable, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { createRef } from 'react'
import { Button, Message } from 'rsuite'
import { assets } from 'src/utils/assets/assets'
import { CardPath } from 'src/cards/CardPath'
import { ActionPicker1UI } from 'src/cards/CardPicker1UI'
import { ActionPicker2UI } from 'src/cards/CardPicker2UI'
import { LiteGraphJSON } from 'src/core/LiteGraph'
import { ImageID } from 'src/models/Image'
import { Trigger } from 'src/shortcuts/Trigger'
import { stringifyUnknown } from 'src/utils/formatters/stringifyUnknown'
import { MarketplaceUI } from '../../cards/MarketplaceUI'
import { CardUI } from '../../widgets/drafts/CardUI'
import { CurrentDraftUI, DraftUI } from '../../widgets/drafts/DraftUI'
import { GalleryUI } from '../../widgets/galleries/GalleryUI'
import { WidgetPaintUI } from '../../controls/widgets/WidgetPaintUI'
import { ComfyUIUI } from '../../widgets/workspace/ComfyUIUI'
import { LastGraphUI } from '../../widgets/workspace/LastGraphUI'
import { StepListUI } from '../../widgets/workspace/StepListUI'
import { ComfyNodeExplorerUI } from './ComfyNodeExplorerUI'
import { HostListUI } from './HostListUI'
import { LastImageUI } from './LastImageUI'
import { PanelConfigUI } from './PanelConfigUI'
import { SceneViewer } from 'src/widgets/3dview/3dview1'

// still on phone
enum Widget {
    Gallery = 'Gallery',
    DisplacedImage = 'DisplacedImage',
    Button = 'Button',
    Paint = 'Paint',
    CurrentDraft = 'CurrentDraft',
    Card = 'Card',
    Draft = 'Draft',
    ComfyUI = 'ComfyUI',
    ComfyUINodeExplorer = 'ComfyUINodeExplorer',
    FileList = 'FileList',
    FileList2 = 'FileList2',
    Steps = 'Steps',
    LastGraph = 'LastGraph',
    LastImage = 'LastIMage',
    Civitai = 'Civitai',
    Image = 'Image',
    Marketplace = 'Marketplace',
    Deck = 'Deck',
    Hosts = 'Hosts',
    Config = 'Config',
}

type PerspectiveDataForSelect = {
    label: string
    value: string
}

export class CushyLayoutManager {
    model!: Model
    private modelKey = 0
    setModel = (model: Model) => {
        this.model = model
        this.modelKey++
    }
    currentPerspectiveName = 'default'
    allPerspectives: PerspectiveDataForSelect[] = [
        //
        { label: 'default', value: 'default' },
        { label: 'test', value: 'test' },
    ]

    saveCurrent = () => this.saveCurrentAs(this.currentPerspectiveName)
    saveCurrentAsDefault = () => this.saveCurrentAs('default')
    saveCurrentAs = (perspectiveName: string) => {
        const curr: FL.IJsonModel = this.model.toJson()
        this.st.configFile.update((t) => {
            t.layouts_2 ??= {}
            t.layouts_2[perspectiveName] = curr
        })
    }

    resetCurrent = (): void => this.reset(this.currentPerspectiveName)
    resetDefault = (): void => this.reset('default')
    reset = (perspectiveName: string): void => {
        this.st.configFile.update((t) => {
            t.layouts_2 ??= {}
            delete t.layouts_2[perspectiveName]
        })
        if (perspectiveName === this.currentPerspectiveName) {
            this.setModel(Model.fromJson(this.build()))
        }
    }

    constructor(public st: STATE) {
        const prevLayout = st.configFile.value.layouts_2?.default
        const json = prevLayout ?? this.build()
        try {
            this.setModel(Model.fromJson(json))
        } catch (e) {
            console.log('[💠] Layout: ❌ error loading layout', e)
            // ⏸️ console.log('[💠] Layout: ❌ resetting layout')
            // ⏸️ this.st.configFile.update((t) => (t.perspectives = {}))
            this.setModel(Model.fromJson(this.build()))
            // this.setModel(Model.fromJson({ layout: { type: 'row', children: [] } }))
        }
        makeAutoObservable(this)
    }

    layoutRef = createRef<Layout>()
    updateCurrentTab = (p: Partial<FL.TabNode>) => {
        const tab = this.currentTab
        if (tab == null) return
        this.model.doAction(Actions.updateNodeAttributes(tab.getId(), p))
    }

    currentTabSet: Maybe<FL.TabSetNode> = null
    currentTab: Maybe<FL.Node> = null
    currentTabID: Maybe<string> = null
    UI = observer(() => {
        console.log('[💠] Rendering Layout')
        return (
            <Layout //
                onModelChange={(model) => {
                    runInAction(() => {
                        this.currentTabSet = model.getActiveTabset()
                        this.currentTab = this.currentTabSet?.getSelectedNode()
                        this.currentTabID = this.currentTab?.getId()
                    })
                    console.log(`[💠] Layout: 📦 onModelChange`)
                    this.saveCurrentAsDefault()
                }}
                ref={this.layoutRef}
                model={this.model}
                factory={this.factory}
            />
        )
    })

    nextPaintIDx = 0
    addMarketplace = () =>
        this._AddWithProps(Widget.Marketplace, `/marketplace`, { title: 'Marketplace', icon: assets.public_CushyLogo_512_png })
    addDisplacedImage = (p: { image: string; depth: string; normal: string }) =>
        this._AddWithProps(Widget.DisplacedImage, `/DisplacedImage`, {
            title: 'DisplacedImage',
            image: p.image,
            depth: p.depth,
            normal: p.normal,
        })
    addActionPicker = () =>
        this._AddWithProps(Widget.FileList, `/Library`, { title: 'Library', icon: assets.public_CushyLogo_512_png })
    addActionPickerTree = () =>
        this._AddWithProps(Widget.FileList2, `/filetree`, { title: 'Library Files', icon: assets.public_CushyLogo_512_png })
    addCivitai = () => this._AddWithProps(Widget.Civitai, `/civitai`, { title: 'CivitAI', icon: assets.public_CivitaiLogo_png })
    addConfig = () => this._AddWithProps(Widget.Config, `/config`, { title: 'Config' })
    addPaint = (imgID?: ImageID) => {
        const icon = assets.public_minipaint_images_logo_svg
        if (imgID == null) {
            this._AddWithProps(Widget.Paint, `/paint/blank`, { title: 'Paint', icon })
        } else {
            this._AddWithProps(Widget.Paint, `/paint/${imgID}`, { title: 'Paint', imgID, icon })
        }
    }
    addImage = (imgID: ImageID) => this._AddWithProps(Widget.Image, `/image/${imgID}`, { title: '🎇 Image', imgID })
    addLastImage = () => this._AddWithProps(Widget.LastImage, `/lastImage`, { title: '🎇 Last Image' })
    addGallery = () => this._AddWithProps(Widget.Gallery, `/gallery`, { title: 'Gallery' })
    addHosts = () => this._AddWithProps(Widget.Hosts, `/hosts`, { title: 'Hosts' })
    addComfy = (litegraphJson?: LiteGraphJSON) => {
        const icon = assets.public_ComfyUILogo_png
        if (litegraphJson == null) {
            return this._AddWithProps(Widget.ComfyUI, `/litegraph/blank`, { title: 'Comfy', icon, litegraphJson: null })
        } else {
            const hash = uniqueIDByMemoryRef(litegraphJson)
            return this._AddWithProps(Widget.ComfyUI, `/litegraph/${hash}`, { title: 'Comfy', icon, litegraphJson })
        }
    }
    addComfyNodeExplorer = () => {
        const icon = assets.public_ComfyUILogo_png
        this._AddWithProps(Widget.ComfyUINodeExplorer, `/ComfyUINodeExplorer`, { title: `Node Explorer`, icon })
    }

    addCard = (actionPath: CardPath) => {
        const af = this.st.library.getCard(actionPath)
        const icon = af?.illustrationPathWithFileProtocol
        this._AddWithProps(Widget.Card, `/action/${actionPath}`, { title: actionPath, actionPath, icon })
    }

    addCurrentDraft = () => {
        this._AddWithProps(Widget.CurrentDraft, `/draft`, { title: 'Current Draft' })
    }
    addDraft = (title: string, draftID: DraftID) => {
        const draft = this.st.db.drafts.get(draftID)
        const af = draft?.card
        const icon = af?.illustrationPathWithFileProtocol
        this._AddWithProps(Widget.Draft, `/draft/${draftID}`, { title, draftID, icon }, 'current')
    }

    renameTab = (tabID: string, newName: string) => {
        const tab = this.model.getNodeById(tabID)
        if (tab == null) return
        this.model.doAction(Actions.renameTab(tabID, newName))
    }

    /** quickly rename the current tab */
    renameCurrentTab = (newName: string) => {
        const tabset = this.model.getActiveTabset()
        if (tabset == null) return
        const tab = tabset.getSelectedNode()
        if (tab == null) return
        const tabID = tab.getId()
        this.model.doAction(Actions.renameTab(tabID, newName))
    }

    closeCurrentTab = () => {
        // 1. find tabset
        const tabset = this.model.getActiveTabset()
        if (tabset == null) return Trigger.UNMATCHED_CONDITIONS
        // 2. find active tab
        const tab = tabset.getSelectedNode()
        if (tab == null) return Trigger.UNMATCHED_CONDITIONS
        // 3. close tab
        const tabID = tab.getId()
        this.model.doAction(Actions.deleteTab(tabID))
        // 4. focus preview tab in the tabset if it exists
        const prevTab = tabset.getSelectedNode()
        if (prevTab != null) this.model.doAction(Actions.selectTab(prevTab.getId()))
        // 5. mark action as success
        return Trigger.Success
    }

    closeTab = (tabID: string) => {
        const shouldRefocusAfter = this.currentTabID === tabID
        this.model.doAction(Actions.deleteTab(tabID))
        return Trigger.Success
    }

    private _AddWithProps = <T extends { icon?: string; title: string }>(
        //
        widget: Widget,
        tabID: string,
        p: T,
        where: 'current' | 'main' = 'main',
    ): Maybe<FL.Node> => {
        // 1. ensure layout is present
        const currentLayout = this.layoutRef.current
        if (currentLayout == null) return void console.log('❌ no currentLayout')

        // 2. get previous tab
        let prevTab: FL.TabNode | undefined
        prevTab = this.model.getNodeById(tabID) as FL.TabNode // 🔴 UNSAFE ?
        console.log(`🦊 prevTab for ${tabID}:`, prevTab)

        // 3. create tab if not prev type
        if (prevTab == null) {
            currentLayout.addTabToTabSet('MAINTYPESET', {
                component: widget,
                id: tabID,
                icon: p.icon,
                name: p.title,
                config: p,
            })
            prevTab = this.model.getNodeById(tabID) as FL.TabNode // 🔴 UNSAFE ?
            if (prevTab == null) return void console.log('❌ no tabAdded')
        } else {
            this.model.doAction(Actions.updateNodeAttributes(tabID, { config: p }))
            this.model.doAction(Actions.selectTab(tabID))
        }
        // 4. merge props
        this.model.doAction(Actions.updateNodeAttributes(tabID, p))
        return prevTab
    }

    factory = (node: FL.TabNode): React.ReactNode => {
        const component = node.getComponent() as Widget
        const extra = node.getConfig()

        try {
            if (component === Widget.Button) return <Button>{node.getName()}</Button>
            if (component === Widget.Gallery) return <GalleryUI />
            if (component === Widget.Paint) return <WidgetPaintUI action={{ type: 'paint', imageID: extra.imgID }} /> // You can now use imgID to instantiate your paint component properly
            if (component === Widget.Image) return <LastImageUI imageID={extra.imgID}></LastImageUI> // You can now use imgID to instantiate your paint component properly
            if (component === Widget.Card) return <CardUI actionPath={extra.actionPath} />
            if (component === Widget.ComfyUI) return <ComfyUIUI litegraphJson={extra.litegraphJson} />
            if (component === Widget.FileList) return <ActionPicker2UI />
            if (component === Widget.FileList2) return <ActionPicker1UI />
            if (component === Widget.Steps) return <StepListUI />
            if (component === Widget.LastGraph) return <LastGraphUI />
            if (component === Widget.LastImage) return <LastImageUI />
            if (component === Widget.Civitai) return <iframe className='w-full h-full' src={'https://civitai.com'} frameBorder='0'></iframe> // prettier-ignore
            if (component === Widget.Hosts) return <HostListUI />
            if (component === Widget.Marketplace) return <MarketplaceUI />
            if (component === Widget.Config) return <PanelConfigUI />
            if (component === Widget.Draft) return <DraftUI draft={extra.draftID} />
            if (component === Widget.CurrentDraft) return <CurrentDraftUI />
            if (component === Widget.ComfyUINodeExplorer) return <ComfyNodeExplorerUI />
            if (component === Widget.Deck) return <div>🔴 todo: action pack page: show readme</div>
            if (component === Widget.DisplacedImage)
                return (
                    <SceneViewer //
                        imageSrc={extra.image}
                        depthMapSrc={extra.depth}
                        normalMapSrc={extra.normal}
                    />
                )
        } catch (e) {
            return (
                <pre tw='text-red-500'>
                    <div>component "{component}" failed to render:</div>
                    error: {stringifyUnknown(e)}
                </pre>
            )
        }

        exhaust(component)
        return (
            <Message type='error' showIcon>
                unknown component
            </Message>
        )
    }

    // 🔴 todo: ensure we correctly pass ids there too
    private _persistentTab = (p: {
        //
        id: string
        name: string
        widget: Widget
        icon?: string
        width?: number
        minWidth?: number
        enableClose?: boolean
    }): FL.IJsonTabNode => {
        return {
            id: p.id,
            type: 'tab',
            name: p.name,
            component: p.widget,
            enableClose: p.enableClose ?? true,
            enableRename: false,
            enableFloat: true,
            icon: p.icon,
        }
    }
    build = (): IJsonModel => {
        const out: IJsonModel = {
            global: {
                // borderSize: 8,
                // tabSetTabStripHeight: 30,
                // enableEdgeDock: true,
                // tabSetMinHeight: 64,
                // tabSetMinWidth: 64,
                tabSetEnableSingleTabStretch: true,
            },

            layout: {
                id: 'rootRow',
                type: 'row',
                children: [
                    {
                        id: 'leftPane',
                        type: 'row',
                        // width: 300,
                        weight: 100,
                        children: [
                            {
                                type: 'tabset',
                                enableSingleTabStretch: true,
                                id: 'MAINTYPESET',
                                enableClose: false,
                                enableDeleteWhenEmpty: false,
                                children: [
                                    this._persistentTab({
                                        name: 'Current Draft',
                                        widget: Widget.CurrentDraft,
                                        enableClose: false,
                                        id: '/draft',
                                    }),
                                    //
                                    // this._persistentTab('Civitai', Widget.Civitai, '/CivitaiLogo.png'),
                                    // this._persistentTab('ComfyUI', Widget.ComfyUI, '/ComfyUILogo.png'),
                                ],
                            },
                            // {
                            //     type: 'tabset',
                            //     enableSingleTabStretch: true,
                            //     minWidth: 200,
                            //     width: 300,
                            //     children: [this._persistentTab({ name: 'Library', widget: Widget.FileList, id: '/Library' })],
                            // },
                        ],
                    },
                    {
                        id: 'rightPane',
                        type: 'row',
                        weight: 100,
                        children: [
                            // {
                            //     type: 'tabset',
                            //     minWidth: 100,
                            //     height: 100,
                            //     minHeight: 100,
                            //     children: [
                            //         this._persistentTab({ name: 'Last Graph', id: '/lastGraph', widget: Widget.LastGraph }),
                            //     ],
                            // },
                            {
                                type: 'tabset',
                                minWidth: 150,
                                minHeight: 300,
                                children: [
                                    this._persistentTab({
                                        name: 'Last Image',
                                        id: '/lastImage',
                                        widget: Widget.LastImage,
                                        enableClose: false,
                                    }),
                                ],
                            },
                            {
                                type: 'tabset',
                                height: 200,
                                minWidth: 150,
                                minHeight: 150,
                                children: [
                                    this._persistentTab({ name: '🎆 Gallery', widget: Widget.Gallery, id: '/gallery' }),
                                    // this._persistentTab('Hosts', Widget.Hosts),
                                ],
                            },
                            // {
                            //     type: 'tabset',
                            //     minWidth: 150,
                            //     children: [this._persistentTab({ name: 'Runs', id: '/steps', widget: Widget.Steps })],
                            // },
                        ],
                    },
                    {
                        id: 'middlePane',
                        type: 'row',
                        children: [
                            {
                                type: 'tabset',
                                width: 250,
                                children: [this._persistentTab({ name: 'Runs', id: '/steps', widget: Widget.Steps })],
                            },
                        ],
                    },
                ],
            },
        }

        return out
    }
}

// function App() {
//     const factory = (node) => {
//         var component = node.getComponent()

//         if (component === 'button') {
//             return <button>{node.getName()}</button>
//         }
//     }

//     return <Layout model={model} factory={factory} />
// }
// }
export const exhaust = (x: never) => x

const memoryRefByUniqueID = new WeakMap<object, string>()
export const uniqueIDByMemoryRef = (x: object): string => {
    let id = memoryRefByUniqueID.get(x)
    if (id == null) {
        id = nanoid()
        memoryRefByUniqueID.set(x, id)
    }
    return id
}
