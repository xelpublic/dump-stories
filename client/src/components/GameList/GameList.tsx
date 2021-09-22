import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchGameListPageCount, fetchGameList, fetchOneGame } from '../../http/gameAPI';
import { useHistory } from 'react-router-dom';
import { GameDataStore } from '../../store/GameStore';
import Loader from '../Loader';
import { IGameInfo } from './../../model/game/IGameInfo';
import { PaginationAction } from '../../common/pagination';
import { Paths } from '../../routes/const';
import { IGameData } from './../../model/game/IGameData';
import { ruDateFormatLong } from './../../common/dateFormat';
import { RootContext } from '../../context/RootContext';


export const GameList: React.FC = () => {
    const { game } = useContext(RootContext);
    const [page, setPage] = useState(1);
    const [games, setGames] = useState<IGameInfo[]>([]);
    const [pageCount, setPageCount] = useState(1);
    const history = useHistory();
    const [loading, setLoading] = useState(true);

    const [gameInfoVisible, setGameInfoVisible] = useState(false);
    const [selectedGameData, setSelectedGameData] = useState<IGameData>()

    const currentPageIndent = 1;

    useEffect(() => {
        fetchGameListPageCount().then(data => {
            setPageCount(data)
        })
    }, [pageCount, setPageCount])

    useEffect(() => {
        setLoading(true)
        fetchGameList(page).then(data => {
            const games = data.map(item => {
                const storyType = game.storyTypes.find(story => story.id === item.storyTypeId);
                return {
                    ...item,
                    gameType: storyType ? storyType.description : ''
                } as IGameInfo
            })
            return games

        }).then(games => {
            setTimeout(() => {
                setGames(games)
                setLoading(false)
            }, 200)

        })
    }, [page, setPage])

    useEffect(() => {
        if (!gameInfoVisible) {
            return;
        }

        const elem = document.getElementById('game-info-modal');
        if (!elem) {
            return;
        }
        var instance = M.Modal.init(elem, {
            onCloseStart: () => {
                setGameInfoVisible(false)
            },
        });
        instance.open();


    }, [gameInfoVisible, setGameInfoVisible])

    const getPages = () => {
        const pages = []

        const pageScopeStart = page - currentPageIndent > 1 ? page - currentPageIndent : 1
        const pageScopeEnd = page + currentPageIndent < pageCount ? page + currentPageIndent : pageCount

        pages.push({
            action: PaginationAction.prevPage,
            pageNum: page > 1 ? page - 1 : -1
        })

        if (pageScopeStart > 1) {
            pages.push({
                action: PaginationAction.prevPageScope,
                pageNum: pageScopeStart - currentPageIndent > 0 ? pageScopeStart - currentPageIndent : 1
            })
        }

        for (let i = pageScopeStart; i <= pageScopeEnd; i++) {
            pages.push({
                action: PaginationAction.goToPage,
                pageNum: i
            })
        }

        if (pageScopeEnd < pageCount) {
            pages.push({
                action: PaginationAction.nextPageScope,
                pageNum: pageScopeEnd + currentPageIndent < pageCount ? pageScopeEnd + currentPageIndent : pageCount
            })
        }

        pages.push({
            action: PaginationAction.nextPage,
            pageNum: page < pageCount ? page + 1 : -1
        })

        return pages;
    }

    const continueGame = async (id: string) => {

        fetchOneGame(id).then(data => {
            const cGame = new GameDataStore(data.id, data.storyTypeId,
                data.gameInProgress,
                data.currentPlayerIndex,
                data.currentQuestionIndex,
                data.playersNames,
                data.answers
            )
            game.currentGame = cGame;

            history.push(Paths.Game);
        });
    }

    const showGameData = (id: string) => {

        console.log('selectedGameData?.id', selectedGameData?.id)
        console.log('id', id)

        if (selectedGameData?.id === id) {
            console.log('повторно')
            setGameInfoVisible(true);
            return;
        }

        fetchOneGame(id).then(data => {
            data.storyType = game.storyTypes.find(story => story.id === data.storyTypeId);

            setSelectedGameData(data);
            console.log('selectedGameData', selectedGameData);

            setGameInfoVisible(true);
        })
    }

    return (
        <div className="container">
            <h4 className="mt-3 mb-3">Список игр</h4>

            {loading && <Loader />}

            {loading ? null :
                !games.length ?
                    <p className="center">Нет сохраненных игр</p>
                    :
                    <div>
                        <table className="table highlight">
                            <thead>
                                <tr>
                                    <th>Дата</th>
                                    <th>Код игры</th>
                                    <th>Игроков</th>
                                    <th>Завершена</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {games.map((item, index) => {
                                    console.log('list render item:', item)
                                    return (
                                        <tr key={item.id}>
                                            <td>{ruDateFormatLong(item.date)}</td>
                                            <td>{item.gameType}</td>
                                            <td><span className="ml-3">{item.playersNumber}</span></td>
                                            <td>
                                                <span>
                                                    {
                                                        !item.gameInProgress ?
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check2" viewBox="0 0 16 16">
                                                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                                            </svg>
                                                            : ""
                                                    }
                                                </span>
                                            </td>
                                            <td>
                                                {item.gameInProgress ?
                                                    <Link to='#' onClick={() => continueGame(item.id)}>Продолжить</Link>
                                                    :
                                                    <Link to='#' onClick={() => showGameData(item.id)}>Просмотреть</Link>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                        <ul className="pagination">

                            {
                                getPages().map(goPage => {

                                    switch (goPage.action) {
                                        case PaginationAction.prevPage:

                                            return (
                                                goPage.pageNum > 0 ?
                                                    <li>
                                                        <a className="waves-effect" href="#!"
                                                            onClick={() => setPage(goPage.pageNum)}
                                                        >
                                                            <i className="material-icons">chevron_left</i>
                                                        </a>
                                                    </li> :
                                                    <li className="disabled">
                                                        <a className="waves-effect" href="#!">
                                                            <i className="material-icons">chevron_left</i>
                                                        </a>
                                                    </li>
                                            )
                                        case PaginationAction.prevPageScope:
                                            return (
                                                <li className="waves-effect">
                                                    <a href="#!"
                                                        onClick={() => setPage(goPage.pageNum)}
                                                    >...</a>
                                                </li>
                                            )
                                        case PaginationAction.goToPage:
                                            if (goPage.pageNum === page) {
                                                return (
                                                    <li className="active">
                                                        <a href="#!">{goPage.pageNum}</a>
                                                    </li>
                                                )
                                            }
                                            return (
                                                <li className="waves-effect">
                                                    <a href="#!"
                                                        onClick={() => setPage(goPage.pageNum)}
                                                    >{goPage.pageNum}</a>
                                                </li>
                                            )
                                        case PaginationAction.nextPageScope:
                                            return (
                                                <li className="waves-effect">
                                                    <a href="#!"
                                                        onClick={() => setPage(goPage.pageNum)}
                                                    >...</a>
                                                </li>
                                            )
                                        case PaginationAction.nextPage:
                                            return (
                                                goPage.pageNum > 0 ?
                                                    <li className="waves-effect">
                                                        <a href="#!"
                                                            onClick={() => setPage(goPage.pageNum)}
                                                        >
                                                            <i className="material-icons">chevron_right</i>
                                                        </a>
                                                    </li> :
                                                    <li className="disabled">
                                                        <a href="#">
                                                            <i className="material-icons">chevron_right</i>
                                                        </a>
                                                    </li>
                                            )
                                    }
                                })
                            }
                        </ul>

                        {gameInfoVisible && selectedGameData ?
                            <div id="game-info-modal" className="modal">
                                <div className="modal-content">
                                    <h5>Игра:</h5>

                                    <p>Играли в <span><em>{selectedGameData.storyType!.description}</em>&nbsp;
                                    </span>Игра закончилась:&nbsp;<em>{ruDateFormatLong(selectedGameData.date)}.
                                        </em>Количество игроков: <em>{selectedGameData.playersNames.length}. </em></p>

                                    <p>Игроки:</p>
                                    <ul>
                                        {selectedGameData.playersNames.map(name =>
                                            <li>{name}</li>
                                        )}
                                    </ul>

                                    {
                                        selectedGameData.answers ?
                                            <div>
                                                <p>Ответы:</p>
                                                <ul>

                                                    {selectedGameData.answers.map(answer =>
                                                        <li><em>{selectedGameData.playersNames[answer.playerIndex]}</em> - вопрос <em>{selectedGameData.storyType!.questions[answer.questionIndex]}</em>, ответ <em>"{answer.text}"</em></li>
                                                    )}

                                                </ul>
                                            </div>
                                            :
                                            <span></span>
                                    }
                                    {
                                        selectedGameData.resultStory ?
                                            <span>
                                                <p>История:</p>
                                                <span className="mt-1" dangerouslySetInnerHTML={{ __html: selectedGameData.resultStory }}></span>
                                            </span>
                                            :
                                            <span></span>
                                    }
                                </div>
                                <div className="modal-footer">
                                    <a href="#!" className="modal-close waves-effect waves-green btn-flat">Закрыть</a>
                                </div>
                            </div>
                            :
                            <span></span>
                        }
                    </div>

            }
        </div>
    )
}
