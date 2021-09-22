import React, { useState, useContext } from 'react';
import { observer } from "mobx-react-lite";
import { RootContext } from '../../context/RootContext';



export const Answer: React.FC = observer(() => {
    const { game } = useContext(RootContext);
    const { user } = useContext(RootContext);
    const [playerAnswer, setPlayerAnswer] = useState('');

    const clickAnswer = async () => {
        if (!playerAnswer) {
            window.alert('Введите ответ');
            return;
        }

        game.currentGame!.addAnswer({
            playerIndex: game.currentGame!.currentPlayerIndex,
            questionIndex: game.currentGame!.currentQuestionIndex,
            text: playerAnswer
        });

        if (game.currentGame!.currentQuestionIndex === game.currentGame!.storyType!.questions.length - 1) {
            game.currentGame!.gameInProgress = false;
            return;
        }

        setPlayerAnswer('');

        game.currentGame!.incrementCurrentQuestionAndPlayerIndex();
    }

    const clickPostponeGame = async () => {
        if (!window.confirm('Вы уверены что хотите отложить игру?')) {
            return;
        }

        game.postponeCurrent();
    }

    return (
        <div className="container">
            <div className="" style={{ width: '35rem' }}>

                <h5 className="marg-b2">Вопрос {game.currentGame!.currentQuestionNumber} из {game.currentGame!.storyType!.questions.length}&nbsp;
                    для, <i> {game.currentGame!.currentPlayerName}</i>
                </h5>

                <h5><i>{game.currentGame!.currentQuestion}</i></h5>

                <textarea
                    className="materialize-textarea"
                    value={playerAnswer}
                    rows={3}
                    onChange={e => setPlayerAnswer(e.target.value)}
                    placeholder="Ваш ответ"
                />

                <div className="at-line marg-t3">
                    {
                        user.isAuth ?
                            <button type="button" className="btn-flat" tabIndex={-1}
                                onClick={clickPostponeGame}>Отложить игру</button>
                            :
                            <span></span>
                    }
                    <button type="button" className="btn"
                        onClick={clickAnswer}>Продолжить</button>

                </div>
            </div>
        </div>
    )
})
