import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, Toolbar, ToolbarButton } from '@fluentui/react-components'
import { observer } from 'mobx-react-lite'

import * as I from '@fluentui/react-icons'
import * as dialog from '@tauri-apps/api/dialog'
import { FontIncrease24Regular, FontDecrease24Regular } from '@fluentui/react-icons'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    return (
        <Toolbar>
            {/* <ToolbarButton aria-label='Increase Font Size' appearance='primary' icon={<FontIncrease24Regular />} /> */}
            <ToolbarButton icon={<I.New24Filled />}>New</ToolbarButton>
            <ToolbarButton icon={<I.Save24Filled />}>Save</ToolbarButton>
            <ToolbarButton
                onClick={() => {
                    dialog.open({
                        title: 'Open',
                        defaultPath: `~`,
                        filters: [
                            //
                            { name: 'Civitai Project', extensions: ['cushy'] },
                        ],
                    })
                    // layout.addHelpPopup()
                }}
            >
                Open
            </ToolbarButton>
            {/* <ToolbarButton aria-label='Decrease Font Size' icon={<FontDecrease24Regular />} /> */}
            <Menu>
                <MenuTrigger disableButtonEnhancement>
                    <Button>Fichier</Button>
                </MenuTrigger>

                {/* <MenuPopover>
                    <MenuList>
                        <MenuItem
                            onClick={() => {
                                dialog.open({
                                    title: 'Open',
                                    defaultPath: `~`,
                                    filters: [
                                        //
                                        { name: 'Civitai Project', extensions: ['cushy'] },
                                    ],
                                })
                                // layout.addHelpPopup()
                            }}
                        >
                            Open
                        </MenuItem>
                        <MenuItem>New Project</MenuItem>
                        <MenuItem icon={<I.Save24Regular />}>Save</MenuItem>
                    </MenuList>
                </MenuPopover> */}
            </Menu>
        </Toolbar>
    )
})
