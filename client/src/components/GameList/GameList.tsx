import React from 'react';
import { fetchGameListPageCount, fetchGameList, fetchOneGame } from '../../http/gameAPI';
import { GameDataStore } from '../../store/GameStore';
import Loader from '../Loader';
import { IGameInfo } from './../../model/game/IGameInfo';
import { Paths } from '../../routes/const';
import { IGameData } from './../../model/game/IGameData';
import { ruDateFormatLong } from './../../common/dateFormat';
import { RootContext } from '../../context/RootContext';
import GameDetails from './GameDatails';
import Pagination from '../Pagination';
import { RouteComponentProps } from "react-router-dom";

interface IProps extends RouteComponentProps {
}

interface IState {
    page: number;
    games: IGameInfo[];
    loading: boolean;
    gameInfoVisible: boolean;
}

class GameList extends React.Component<IProps, IState>  {
    static contextType = RootContext;
    context!: React.ContextType<typeof RootContext>;
    pageCount: number = 0;
    selectedGameData: IGameData | undefined;

    constructor(props: IProps | Readonly<IProps>) {
        super(props);
        this.state = {
            page: 0,
            games: [],
            loading: false,
            gameInfoVisible: false,
        }
    }

    componentDidMount() {
        console.log('componentDidMount')
        this.getData();
    }

    getData = async () => {
        this.setState({ loading: true });

        fetchGameListPageCount()
            .then(data => {
                this.pageCount = data;
                console.log('fetchGameListPageCount', data)
                if (this.pageCount > 0) {
                    this.getGameListData(1);
                }
                else {
                    this.setState({ loading: false });
                }
            })
            .catch(err => {
                this.setState({ loading: false });
                console.log(err)
            });
    }

    getGameListData = async (page: number) => {
        console.log('getGameListData start page', page)

        const game = this.context.game;

        console.log('game', game)
        console.log('game.storyTypes', game.storyTypes)
        if (page < 1 || page > this.pageCount) {
            console.log('недопустимый номер страницы');
            return;
        }

        if (this.state.loading) {
            this.setState({ loading: true });
        }

        fetchGameList(page)
            .then(data => {
                console.log('fetchGameList', data)
                const games = data.map(item => {
                    const storyType = game.storyTypes.find(story => story.id === item.storyTypeId);
                    return {
                        ...item,
                        gameType: storyType ? storyType.description : ''
                    } as IGameInfo
                })
                return games

            })
            .then(games => {
                setTimeout(() => {// для демки лоадера
                    this.setState(
                        {
                            page: page,
                            games: games,
                            loading: false
                        })
                }, 200)
            })
            .catch(err => {
                this.setState({ loading: false });
                console.log(err)
            });
    }

    continueGame = async (id: string) => {
        const game = this.context.game;

        fetchOneGame(id)
            .then(data => {
                if (!data || data.id === undefined) {
                    window.alert('Не удалось получить данные игры!\r\nПопробуйте позже.');
                    return;
                }

                const gameDataStore = new GameDataStore(data.id, data.storyTypeId,
                    data.gameInProgress,
                    data.currentPlayerIndex,
                    data.currentQuestionIndex,
                    data.playersNames,
                    data.answers
                )

                game.currentGame = gameDataStore;

                // console.log('continueGame game.currentGame', game.currentGame);

                this.props.history.push(Paths.Game);
            })
            .catch(err => {
                window.alert('Не удалось получить данные игры!\r\nПопробуйте позже.');
                console.log(err)
            });
    }

    showGameData = async (id: string) => {
        const game = this.context.game;

        console.log('selectedGameData?.id', this.selectedGameData?.id)
        console.log('id', id)

        if (this.selectedGameData?.id === id) {//типа кэширование
            this.setState({ gameInfoVisible: true });
            return;
        }

        fetchOneGame(id)
            .then(data => {
                if (!data || data.id === undefined) {
                    window.alert('Не удалось получить данные игры!\r\nПопробуйте позже.');
                    return;
                }

                data.storyType = game.storyTypes.find(story => story.id === data.storyTypeId);
                this.selectedGameData = data;

                this.setState({
                    gameInfoVisible: true
                });

            })
            .catch(err => {
                window.alert('Не удалось получить данные игры!\r\nПопробуйте позже.');
                console.log(err)
            });
    }

    render() {
        const page = this.state.page;
        console.log('render page=', page)

        const loading = this.state.loading;
        const games = this.state.games;
        const gameInfoVisible = this.state.gameInfoVisible;

        return (
            <div className="container" >
                <h4>Список игр</h4>

                {loading && <Loader />}

                {
                    loading ? null :
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
                                                            <a href='#!' onClick={() => this.continueGame(item.id)}>Продолжить</a>
                                                            :
                                                            <a href='#!' onClick={() => this.showGameData(item.id)}>Просмотреть</a>
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>

                                <Pagination pageCount={this.pageCount}
                                    selectedPage={page}
                                    onSelectPage={(page: number) => this.getGameListData(page)} />

                                {gameInfoVisible && this.selectedGameData ?
                                    <GameDetails gameData={this.selectedGameData}
                                        onClose={() => this.setState({ gameInfoVisible: false })} />
                                    :
                                    <></>
                                }
                            </div>

                }
            </div >
        )
    }
}

export default GameList;
