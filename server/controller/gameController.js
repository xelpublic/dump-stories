const ApiError = require('../error/ApiError');
const { GameData } = require("../model/Game")
const mongoose = require('mongoose');


class GameController {

    async persist(req, res, next) {
        try {
            const inpGameData = req.body.gameData
            const userId = req.user.id
            const plaintData = JSON.parse(inpGameData)
            const gameData = new GameData(plaintData)

            if (plaintData.id) {
                gameData._id = new mongoose.Types.ObjectId(plaintData.id);
            }

            gameData.userId = userId
            gameData.date = Date.now()

            gameData.isNew = ! await GameData.exists({ _id: gameData.id })

            await gameData.save()

            res.json(gameData)
        }
        catch (e) {
            console.log(e.message)
        }
    }

    async getList(req, res, next) {
        const userId = req.user.id
        const { pageCount } = req.query
        let { page, limit } = req.query
        limit = parseInt(limit)
        page = page || 1
        const offset = page * limit - limit

        if (pageCount) {
            let count = 0
            const v0 = await GameData.countDocuments({ userId: userId }, (err, docCount) => {
                if (err) {
                    console.log(err)
                    return next(ApiError.internal('Ошибка БД'))
                }

                count = docCount > 0 ? Math.ceil(docCount / limit) : 0
            })

            res.json(count)
            return
        }

        let games = []

        await GameData.find({ userId: userId },
            'id storyTypeId date gameInProgress playersNames', { skip: offset, limit: limit, sort: { date: -1 } },
            (err, items) => {
                if (err) {
                    console.log(err)
                    return next(ApiError.internal('Ошибка БД'))
                }

                games = items.map((item) => {
                    return (
                        {
                            id: item._id,
                            storyTypeId: item.storyTypeId,
                            date: item.date,
                            gameInProgress: item.gameInProgress,
                            playersNumber: item.playersNames ? item.playersNames.length : 0
                        })
                })
            })

        res.json(games)
    }


    async getById(req, res, next) {
        let gameData

        await GameData.findById(req.params.id
            , (err, item) => {
                if (err) {
                    res.status(500).send(err)
                } else {
                    const plaintItem = item.toObject()
                    gameData = {
                        id: plaintItem._id.toString(),
                        ...plaintItem
                    }

                    return res
                }
            })

        res.json(gameData)
    }
}

module.exports = new GameController()