const Router = require('express')
const router = new Router()
const gameController = require('../controller/gameController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/persist', authMiddleware, gameController.persist)
router.get('/', authMiddleware, gameController.getList)
router.get('/:id', authMiddleware, gameController.getById)

module.exports = router