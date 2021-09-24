import React from 'react';
import { IGameData } from '../../model/game/IGameData';
import { ruDateFormatLong } from '../../common/dateFormat';

interface IProps {
    gameData: IGameData;
    onClose: () => void;
}

class GameDetails extends React.Component<IProps>  {
    modalRef: React.RefObject<HTMLDivElement>

    constructor(props: IProps | Readonly<IProps>) {
        super(props);
        this.modalRef = React.createRef();
    }

    componentDidMount() {
        const elem = this.modalRef.current
        if (!elem) {
            return;
        }
        var instance = M.Modal.init(elem, {
            preventScrolling:false,
            onCloseEnd: () => {
                this.props.onClose();
            }
        });
        instance.open();
    }

    render() {
        const { gameData } = this.props;
        return (
            <div id="game-info-modal" ref={this.modalRef} className="modal">
                <div className="modal-content">
                    <h4 className="marg-b2">Данные игры:</h4>

                    <p>Играли в <span><em>{gameData.storyType!.description}</em>&nbsp;
                    </span>Игра закончилась:&nbsp;<em>{ruDateFormatLong(gameData.date)}.
                        </em>Количество игроков: <em>{gameData.playersNames.length}. </em></p>

                    <p>Игроки:</p>
                    <ul>
                        {gameData.playersNames.map((name,index,arr) =>
                            <li key={"playersName"+index }>{name}</li>
                        )}
                    </ul>

                    {
                        gameData.answers ?
                            <div>
                                <p>Ответы:</p>
                                <ul>

                                    {gameData.answers.map((answer,index,arr) =>
                                        <li key={"answers"+index}><em>{gameData.playersNames[answer.playerIndex]}</em> - вопрос <em>{gameData.storyType!.questions[answer.questionIndex]}</em>, ответ <em>"{answer.text}"</em></li>
                                    )}

                                </ul>
                            </div>
                            :
                            <span></span>
                    }
                    {
                        gameData.resultStory ?
                            <span>
                                <p>История:</p>
                                <span className="mt-1" dangerouslySetInnerHTML={{ __html: gameData.resultStory }}></span>
                            </span>
                            :
                            <span></span>
                    }
                </div>
                <div className="modal-footer">
                    <a href="#!" className="modal-close waves-effect waves-green btn-flat">Закрыть</a>
                </div>
            </div>
        )
    }
}

export default GameDetails;