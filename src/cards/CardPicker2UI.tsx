import type { CardFile } from 'src/cards/CardFile'
import type { Deck } from './Deck'

import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { useSt } from '../state/stateContext'
import { DeckHeaderUI } from './DeckHeaderUI'

export const ActionPicker2UI = observer(function ActionPicker2UI_(p: {}) {
    const st = useSt()
    const library = st.library
    return (
        <>
            {/* <CreateDeckBtnUI /> */}
            {/* FAVORITES */}
            {library.allFavorites.length ? (
                <div
                    tw='cursor-pointer items-center gap-1  hover:bg-gray-800 p-0.5 flex justify-between'
                    onClick={() => (library.favoritesFolded = !library.favoritesFolded)}
                >
                    <div>
                        <span style={{ fontSize: '3rem' }} tw='text-yellow-500' className='material-symbols-outlined'>
                            star
                        </span>
                    </div>
                    <div tw='flex-grow'>
                        <div>Favorite Actiosn</div>
                    </div>
                    <div>{library.favoritesFolded ? '▸' : '▿'}</div>
                </div>
            ) : null}
            {library.favoritesFolded ? null : library.allFavorites.map((af) => <ActionEntryUI key={af.relPath} card={af} />)}
            {/* INSTALLED */}
            <div tw='flex flex-col'>
                {library.decksSorted.map((pack) => (
                    <ActionPackUI key={pack.folderRel} deck={pack} />
                ))}
            </div>
        </>
    )
})

export const ActionPackUI = observer(function ActionPackUI_(p: { deck: Deck }) {
    const deck: Deck = p.deck
    return (
        <div tw='my-0.5 flex-grow' key={deck.folderRel}>
            <DeckHeaderUI deck={deck} />
            {deck.folded ? null : (
                <div>
                    {deck.cards.map((af) => (
                        <ActionEntryUI key={af.relPath} card={af} />
                    ))}
                </div>
            )}
        </div>
    )
})
export const ActionEntryUI = observer(function ActionEntryUI_(p: { card: CardFile }) {
    const st = useSt()
    const card = p.card
    const pack = card.deck
    return (
        <div
            //
            tw='pl-4 hover:bg-gray-900 flex gap-2 cursor-pointer'
            // style={{ borderTop: '1px solid #161616' }}
            key={card.absPath}
            onClick={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                const actionPath = card.relPath
                st.layout.addCard(actionPath)
            }}
        >
            {/* <span className='material-symbols-outlined'>keyboard_arrow_right</span> */}
            <img style={{ width: '1rem', height: '1rem' }} src={pack?.logo ?? ''}></img>
            <div>{card.displayName}</div>
            <div tw='ml-auto'>
                <ActionFavoriteBtnUI card={card} />
            </div>
        </div>
    )
})

export const ActionFavoriteBtnUI = observer(function ActionFavoriteBtnUI_(p: { card: CardFile }) {
    const af = p.card
    return (
        <Fragment>
            {af.isFavorite ? (
                <span
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        af.setFavorite(false)
                    }}
                    //
                    style={{ fontSize: '1.5rem' }}
                    className='material-symbols-outlined text-yellow-500'
                >
                    star
                </span>
            ) : (
                <span
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        af.setFavorite(true)
                    }}
                    style={{ fontSize: '1.5rem' }}
                    tw='hover:text-yellow-500 text-gray-500'
                    className='material-symbols-outlined'
                >
                    star
                </span>
            )}
        </Fragment>
    )
})
