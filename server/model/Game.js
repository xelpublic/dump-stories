const { Schema, model } = require('mongoose')

const AnswerSchema = Schema({
    playerIndex: { type: Number },
    questionIndex: { type: Number },
    text: { type: String }
})

const GameDataSchema = Schema({
    userId: { type: String },
    storyTypeId: { type: String },
    date: { type: Date },
    gameInProgress: { type: Boolean },
    currentPlayerIndex: { type: Number },
    currentQuestionIndex: { type: Number },
    playersNames: { type: [String] },
    answers: { type: [AnswerSchema] },
    resultStory: { type: String }
})

const Answer = model('Answer', AnswerSchema)

const GameData = model('GameData', GameDataSchema)

module.exports = { GameData, Answer }
