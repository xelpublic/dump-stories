const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const gamedRouter = require('./gameRouter')

router.use('/user', userRouter)
router.use('/game', gamedRouter)

module.exports = router
