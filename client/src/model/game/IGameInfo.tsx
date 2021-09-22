import { IStoryType } from "./IStoryType";

export interface IGameInfo{
    id: string,
    date: Date,
    storyTypeId:string,
    gameType: string,
    gameInProgress: boolean,
    playersNumber: number,
    playersNames:string[]
}