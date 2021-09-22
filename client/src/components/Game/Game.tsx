import React, { useContext } from 'react'
import { observer } from "mobx-react-lite"
import { Answer } from './Answer';
import { ResultStory } from './ResultStory';
import { NewGame } from './NewGame';
import { RootContext } from '../../context/RootContext';

export const Game: React.FC = observer(() => {
    const { game } = useContext(RootContext)

    return (
        <div>
            {
                game.currentGame ?
                    game.currentGame.gameInProgress ?
                        <Answer />
                        : <ResultStory />
                    : <NewGame />
            }
        </div>
    )
})
