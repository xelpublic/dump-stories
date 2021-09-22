import { IAnswer } from './IAnswer';
import { IStoryType } from './IStoryType';

export interface IGameData {
    id: string | undefined,
    storyTypeId: string,
    date: Date,
    gameInProgress: boolean,
    currentPlayerIndex: number,
    currentQuestionIndex: number,
    playersNames: string[],
    answers: IAnswer[],
    storyType: IStoryType | undefined
    resultStory: string
}