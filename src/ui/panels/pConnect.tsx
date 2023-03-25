import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    Button,
    Card,
    Input,
    Label,
    Text,
} from '@fluentui/react-components'
import { observer } from 'mobx-react-lite'
import * as I from '@fluentui/react-icons'
import { useSt } from '../stContext'
import { Field } from '@fluentui/react-components/unstable'

export const PConnectUI = observer(function PConnectUI_(p: {}) {
    const client = useSt()
    return (
        <>
            <Accordion collapsible>
                <AccordionItem value='1'>
                    <AccordionHeader>
                        <div>Server </div>
                        <div className='grow'></div>
                        <div>{client.wsStatusEmoji}</div>
                    </AccordionHeader>

                    <AccordionPanel>
                        <Card>
                            <Field label='Workspace Folder'>
                                <Input
                                    contentBefore={'📁'}
                                    value={client.config.config.workspace}
                                    onChange={(ev) => (client.config.config.workspace = ev.target.value)}
                                />
                            </Field>
                            <Field label='http(s) URL to access Comfy'>
                                <Input
                                    contentBefore={'🫖'}
                                    value={client.config.config.comfyHTTPURL}
                                    onChange={(ev) => (client.config.config.comfyHTTPURL = ev.target.value)}
                                />
                            </Field>
                            <Field label='ws(s) ENDPOINT to access Comfy'>
                                <Input
                                    contentBefore={'🧦'}
                                    value={client.config.config.comfyWSURL}
                                    onChange={(ev) => (client.config.config.comfyWSURL = ev.target.value)}
                                />
                            </Field>
                            <Button appearance='primary' onClick={() => client.config.save()} icon={<I.Save24Filled />}>
                                Save
                            </Button>
                        </Card>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
            {/* <Card>
                <Label>
                    Host
                    <Input type='text' value={client.serverIP} onChange={(e) => (client.serverIP = e.target.value)} />
                </Label>
                <Label>
                    Port
                    <Input
                        type='number'
                        value={client.serverPort.toString()}
                        onChange={(e) => (client.serverPort = parseInt(e.target.value, 10))}
                    />
                </Label>
                <Button appearance='primary' onClick={() => setTimeout(() => window.location.reload(), 1000)}>
                    connect
                </Button>
            </Card> */}
        </>
    )
})
