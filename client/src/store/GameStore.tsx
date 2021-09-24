import { StoryType1, StoryType2, StoryType3 } from './../common/StoryType';
import { persistGame } from './../http/gameAPI';
import { IAnswer } from './../model/game/IAnswer';
import { makeAutoObservable } from "mobx";
import { IStoryType } from "../model/game/IStoryType";
import { IGameData } from './../model/game/IGameData';

class GameStore {
    private _currentGame: GameDataStore | undefined;

    private _storyTypes: IStoryType[];

    constructor() {
        this._storyTypes = this._aquireStoryTypes()
        makeAutoObservable(this)
    }

    public get currentGame() {
        return this._currentGame;
    }
    public set currentGame(value) {
        if (value) {
            value._setGameStore(this)
        }
        this._currentGame = value;
    }

    public get storyTypes() {
        return this._storyTypes;
    }

    private _aquireStoryTypes(): IStoryType[] {
        const arr = [StoryType1, StoryType2, StoryType3];
        return arr;
    }

    public postponeCurrent() {
        if (!this._currentGame) {
            return;
        }
        this._currentGame.persist()
        this._currentGame = undefined;
    }

}


class GameDataStore implements IGameData {
    private _id: string | undefined = undefined;

    private _gamestore: GameStore | undefined = undefined

    private _storyTypeId: string;

    private _gameInProgress: boolean = false;

    private _currentPlayerIndex: number = 0;

    private _currentQuestionIndex: number = 0;

    private _playersNames: string[] = [];

    private _answers: IAnswer[] = [];

    private _resultStory: string = '';

    constructor(id: string | undefined = undefined,
        storyTypeId: string,
        gameInProgress = false,
        currentPlayerIndex = 0,
        currentQuestionIndex = 0,
        playersNames: string[] = [],
        answers: IAnswer[] = []) {

        this._id = id
        this._storyTypeId = storyTypeId
        this._gameInProgress = gameInProgress
        this._currentPlayerIndex = currentPlayerIndex
        this._currentQuestionIndex = currentQuestionIndex
        this._playersNames = playersNames
        this._answers = answers

        makeAutoObservable(this)
    }

    public get id(): string | undefined {
        return this._id;
    }

    public get storyTypeId(): string {
        return this._storyTypeId;
    }

    public get gameInProgress(): boolean {
        return this._gameInProgress;
    }
    public set gameInProgress(value: boolean) {
        this._gameInProgress = value;
    }

    public get currentPlayerIndex(): number {
        return this._currentPlayerIndex;
    }
    public set currentPlayerIndex(value: number) {
        this._currentPlayerIndex = value;
    }

    public get currentQuestionIndex(): number {
        return this._currentQuestionIndex;
    }
    public set currentQuestionIndex(value: number) {
        this._currentQuestionIndex = value;
    }

    public get playersNames(): string[] {
        return this._playersNames;
    }

    public get answers(): IAnswer[] {
        return this._answers;
    }

    public get resultStory(): string {
        return this._resultStory;
    }

    public get date(): Date {
        return new Date();
    }

    public set resultStory(value: string) {
        this._resultStory = value;
    }

    _setGameStore(store: GameStore) {
        this._gamestore = store
    }

    addAnswer(answer: IAnswer) {
        this.answers.push(answer)
    }

    get currentPlayerName() {
        if (this.currentPlayerIndex >= this.playersNames.length) {
            return ''
        }

        return this.playersNames[this.currentPlayerIndex]
    }

    get storyType() {
        return this._gamestore!.storyTypes.find(story => story.id === this.storyTypeId)
    }

    get currentQuestionNumber() {
        return this.currentQuestionIndex + 1
    }

    get currentQuestion() {
        const story = this.storyType
        if (!story || this.currentQuestionIndex >= story.questions.length) {
            return ''
        }

        return story.questions[this.currentQuestionIndex]
    }

    incrementCurrentQuestionAndPlayerIndex() {
        this.currentPlayerIndex = this.currentPlayerIndex < this.playersNames.length - 1 ?
            this.currentPlayerIndex + 1 : 0;
        this.currentQuestionIndex++;

    }

    makeResultStory() {
        if (this.resultStory) {
            return;
        }

        let resStory = this.storyType!.storyPattern;

        for (let answer of this.answers) {
            resStory = resStory.replace('{' + answer.questionIndex + '}', answer.text);
        }

        this.resultStory = resStory;
    }

    toJSON() {
        return {
            id: this.id,
            storyTypeId: this.storyTypeId,
            date: this.date,
            gameInProgress: this.gameInProgress,
            currentPlayerIndex: this.currentPlayerIndex,
            currentQuestionIndex: this.currentQuestionIndex,
            playersNames: this.playersNames,
            answers: this.answers,
            resultStory: this.resultStory
        }
    }

    persist() {
        const gameData = JSON.stringify(this)

        // console.log('persist gameData', gameData);
        persistGame(gameData);
    }
}

const gameStore = new GameStore();

export default gameStore;

export { GameStore, GameDataStore };