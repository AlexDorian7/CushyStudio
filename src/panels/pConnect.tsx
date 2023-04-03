import { Card, Input, Label, Textarea, Title3 } from '@fluentui/react-components'
import { Alert, Field } from '@fluentui/react-components/unstable'
import * as I from '@fluentui/react-icons'
import { observer } from 'mobx-react-lite'
import { useWorkspace } from '../ui/WorkspaceContext'

export const PConnectUI = observer(function PConnectUI_(p: {}) {
    const workspace = useWorkspace()
    const cushy = workspace.cushy
    return (
        <div className='col gap'>
            <Card>
                <Title3>Workspace</Title3>
                <Field label='Root folder'>
                    <Input
                        disabled
                        contentBefore={'📁'}
                        value={workspace.absoluteWorkspaceFolderPath}
                        onChange={(ev) => workspace.workspaceConfigFile.update({ comfyHTTPURL: ev.target.value })}
                    />
                </Field>
            </Card>
            <Card>
                <h3 className='row'>
                    <Title3>Connection </Title3>
                    <div className='grow'></div>
                    <div>{workspace.ws.emoji}</div>
                </h3>
                {/* <Switch value={} /> */}
                {/* <Field label='Workspace Folder'>
                                <Input
                                contentBefore={'📁'}
                                value={client._config.config.workspace}
                                onChange={(ev) => (client._config.config.workspace = ev.target.value)}
                                />
                            </Field> */}
                <Field label='Comfy HTTP(s) server'>
                    <Input
                        contentBefore={'🫖'}
                        value={workspace.workspaceConfigFile.value.comfyHTTPURL}
                        onChange={(ev) => workspace.workspaceConfigFile.update({ comfyHTTPURL: ev.target.value })}
                    />
                </Field>
                <Field label='Comfy websocket endpoint'>
                    <Input
                        contentBefore={'🧦'}
                        value={workspace.workspaceConfigFile.value.comfyWSURL}
                        onChange={(ev) => workspace.workspaceConfigFile.update({ comfyWSURL: ev.target.value })}
                    />
                </Field>
                {/* <div className='row gap'>
                    <Button appearance='primary' onClick={() => client.config.save()} icon={<I.Save24Filled />}>
                        Save
                    </Button>
                </div> */}
                {workspace.workspaceConfigFile.value.comfyWSURL.endsWith('/ws') ? null : (
                    <Alert appearance='inverted' icon={<I.Warning24Filled color='red' />}>
                        did you forget `/ws` at the end of the websocket url ?
                    </Alert>
                )}
            </Card>
            {/* <LoggerUI className='grow' /> */}
            <Card>
                <Title3>Global Config</Title3>
                <div>
                    <Label>global config folder: </Label>
                    <code className='highlighted'>"{cushy.rootFolder.absPath}"</code>
                </div>
                <div>
                    <Label>global config file:</Label>
                    <code className='highlighted'>"{cushy.globalConfigAbsPath}"</code>
                </div>
                <pre>{JSON.stringify(workspace.cushy.userConfig.value, null, 3)}</pre>
            </Card>
        </div>
    )
})
