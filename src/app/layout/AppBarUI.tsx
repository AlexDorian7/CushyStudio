import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, IconButton } from 'rsuite'
import { assets } from 'src/utils/assets/assets'
import { useSt } from '../../state/stateContext'
import { MainNavBarUI } from './MainNavBarUI'
import { SchemaIndicatorUI } from './SchemaIndicatorUI'
import { UpdateBtnUI } from './UpdateBtnUI'
import { WebsocketIndicatorUI } from './WebsocketIndicatorUI'
import { openExternal } from './openExternal'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const st = useSt()
    return (
        <div id='CushyAppBar' style={{ borderBottom: '1px solid #2b2b2b' }}>
            <div
                style={{ borderBottom: '1px solid #2b2b2b' }}
                tw='flex items-center gap-2 px-1 overflow-auto bg-contrasted-gradient'
            >
                <div tw='flex p-2 gap-1 self-start'>
                    <img style={{ width: '1rem' }} src={assets.public_CushyLogo_512_png} alt='' />
                    <div tw='whitespace-nowrap'>Cushy Studio</div>
                    <UpdateBtnUI updater={st.updater} />
                </div>
                <div className='flex flex-grow'></div>
                <WebsocketIndicatorUI />
                <SchemaIndicatorUI />
                <CushyStudioLinkUI />
            </div>
            <div tw='p-1'>
                <MainNavBarUI />
            </div>
        </div>
    )
})

export const CushyStudioLinkUI = observer(function CushyStudioLinkUI_(p: {}) {
    return (
        <Button
            as='a'
            tw='self-start flex-shrink-0'
            appearance='link'
            href='#'
            onClick={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                window.require('electron').shell.openExternal('https://github.com/rvion/CushyStudio')
            }}
        >
            {/* <span className='material-symbols-outlined text-yellow-600'>star</span> */}
            rvion/CushyStudio
            <img src={assets.public_GithubLogo2_png} alt='Github Logo' style={{ width: '1.4rem', height: '1.4rem' }} />
        </Button>
    )
})

export const DBHealthUI = observer(function DBHealthUI_(p: {}) {
    const st = useSt()
    const dbHealth = st.db.health
    const color = dbHealth.status === 'bad' ? 'red' : dbHealth.status === 'meh' ? 'yellow' : 'green'
    return (
        <Button
            //
            size='xs'
            appearance='subtle'
            color={color}
            onClick={() => st.db.reset()}
            startIcon={<I.Reload />}
            // startIcon={<span className='material-symbols-outlined'>power_settings_new</span>}
        >
            DB ({dbHealth.sizeTxt})
        </Button>
    )
})

export const OpenComfyExternalUI = observer(function OpenComfyExternalUI_(p: {}) {
    const st = useSt()
    return (
        <IconButton
            size='sm'
            appearance='subtle'
            className='self-start'
            icon={<span className='material-symbols-outlined'>open_in_new</span>}
            onClick={() => openExternal(st.getServerHostHTTP())}
            // endIcon={}
        >
            {/* ComfyUI Web */}
        </IconButton>
    )
})
