const ApiError = require('../error/ApiError');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../model/User')
const config = require('config')

const generateJwt = (id, userLogin, role) => {
    return jwt.sign(
        { id, userLogin, role },
        config.get('jwtSecret'),
        { expiresIn: '24h' }
    )
}

class UserController {
    async registration(req, res, next) {
        const { userLogin, password, role } = req.body

        if (!userLogin || !password || !role) {
            return next(ApiError.badRequest('Некорректный данные при регистрации'))
        }

        const existUser = await User.findOne({ userLogin })

        if (existUser) {
            return res.status(400).json({ message: `Логин ${userLogin} уже занят ` })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = new User({ login: userLogin, password: hashedPassword, role })
        await user.save()

        const token = generateJwt(user.id, user.login, user.role)

        return res.json({ token })
    }

    async login(req, res, next) {
        const { userLogin, password } = req.body

        const existUser = await User.findOne({ login: userLogin })

        if (!existUser || !await bcrypt.compare(password, existUser.password)) {
            return res.status(400).json({ message: 'Пользователь с такими данными не найден' })
        }

        const token = generateJwt(existUser.id, existUser.login, existUser.role)

        res.json({ token })
    }

    async auth(req, res, next) {
        const token = generateJwt(req.user.id, req.user.userLogin, req.user.role)

        return res.json({ token })
    }
}

module.exports = new UserController()
