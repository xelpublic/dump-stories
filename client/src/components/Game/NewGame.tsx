import React, { useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { GameDataStore } from '../../store/GameStore';
import { RootContext } from '../../context/RootContext';


export const NewGame: React.FC = observer(() => {
    const { game } = useContext(RootContext);
    const [storyType, setStoryType] = useState(game.storyTypes[0]);
    const [playersCount, setPlayersCount] = useState(1);
    const [playersNames, setPlayersNames] = useState(['Игрок 1']);

    useEffect(() => {
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {});
    }, [])

    useEffect(() => {
        if (playersCount > storyType.questions.length) {
            setPlayersCount(storyType.questions.length);
        }

    }, [storyType, playersCount]);

    useEffect(() => {
        if (!playersCount) {
            return;
        }
        if (playersCount > storyType.questions.length) {
            setPlayersCount(storyType.questions.length);
            return;
        }

        let newArr = new Array(playersCount);
        let playerNameCounter = 1;

        for (let i = 0; i < playersCount; i++) {
            if (i < playersNames.length) {
                newArr[i] = playersNames[i];
                console.log('v1', i, ' ', newArr[i]);
                continue;
            }

            let newPlayerName = 'Игрок ' + playerNameCounter++;

            while (newArr.includes(newPlayerName, 0)) {
                newPlayerName = 'Игрок ' + playerNameCounter++;
            }

            newArr[i] = newPlayerName;
        }

        setPlayersNames(newArr);
    }, [playersCount]);

    const changePlayerName = (index: number, newName: string) => {
        setPlayersNames(playersNames.map((value, idx, arr) => idx === index ? newName : value));
    }

    const removePlayer = (index: number) => {
        playersNames.splice(index, 1);
        setPlayersCount(playersCount - 1);
    }

    function changeStoryType(event: React.ChangeEvent<HTMLSelectElement>) {
        const index = Number.parseInt(event.target.value);
        setStoryType(game.storyTypes[index]);
    }

    const clickNewGame = async () => {
        try {
            // if (!playersCount) {
            //     alert('Выберите количество игроков');
            //     return;
            // }
            if (!storyType) {
                alert('Выберите историю');
                return;
            }
            if (!playersNames || playersNames.length < 1) {
                alert('Выберите игроков');
                return;
            }

            const newGame = new GameDataStore(undefined, storyType.id, true, 0, 0, playersNames);
            game.currentGame = newGame;

        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="container">
            <div style={{ width: '35rem' }}>

                <div className="at-line marg-b2">
                    <h4 className="" style={{ marginBottom: '15px' }}>Новая игра</h4>
                    <button type="button" className="btn"
                        style={{ width: '10rem' }}
                        onClick={clickNewGame}>Начать</button>
                </div>

                <div className="input-field">

                    <select className=""
                        id="storyType"
                        onChange={e => changeStoryType(e)}
                        required>
                        {game.storyTypes.map((type, index, arr) =>
                            <option key={type.id}
                                value={index}
                            >{type.description}</option>
                        )}
                    </select>
                    <label htmlFor="storyType">Тип игры: </label>

                </div>

                <h6 className="marg-b2">максимум игроков: {storyType.questions.length || '--'}</h6>

                <div className="input-field marg-b2">
                    <div className="">
                        <label htmlFor="playersCount">Количество игроков: </label>
                        <input type="number"
                            className=""
                            id="playersCount"
                            placeholder="Количество игроков"
                            value={playersCount}
                            onChange={e => setPlayersCount(Number.parseInt(e.target.value))} />
                    </div>
                </div>

                <label className="" htmlFor="playersNames">Игроки: </label>

                    <ul className="input-field" id="playersNames">
                        {playersNames.map((item, index, array) =>
                            <li className="at-line" key={index}>
                                <input type="text"
                                    className=""
                                    value={item}
                                    onChange={(e) => changePlayerName(index, e.target.value)}
                                    placeholder="Введите имя игрока"
                                    required />
                                <button type="button" className="waves-effect waves-light btn-flat"
                                    onClick={() => removePlayer(index)}>&times;</button>
                            </li>
                        )}
                    </ul>

            </div>
        </div >
    )
})