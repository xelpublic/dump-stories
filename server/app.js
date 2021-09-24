const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')
const router = require('./route/index')

const app = express()

app.use(cors())
app.use(express.json({ extended: true }))
app.use('/api', router)

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, '..\client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..\client', 'build', 'index.html'))
    })
}

const PORT = config.get('port') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            // useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 60000
        })
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()