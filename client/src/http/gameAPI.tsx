import { $authHost } from "./index";
import { IGameInfo } from './../model/game/IGameInfo';
import { IGameData } from './../model/game/IGameData';

const pageLimit = 2

export const persistGame = async (gameData: string) => {
    const { data } = await $authHost.post('/api/game/persist', { gameData })
    return data
}

export const fetchGameListPageCount = async (limit = pageLimit) => {
    const { data } = await $authHost.get<number>('/api/game', {
        params: { pageCount: true, limit }
    })
    return data
}

export const fetchGameList = async (page: number, limit = pageLimit) => {
    const { data } = await $authHost.get<IGameInfo[]>('/api/game', {
        params: { page, limit }
    })
    return data
}

export const fetchOneGame = async (id: string) => {
    const { data } = await $authHost.get<IGameData>('/api/game/' + id)
    return data
}