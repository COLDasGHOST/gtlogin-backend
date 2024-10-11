const express = require('express')
const bodyParser = require('body-parser')
const rateLimiter = require('express-rate-limit')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

const limiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    headers: true,
})

app.use(cors({
    origin: 'www.growtopia1.com',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('combined'))

app.use(limiter)

app.post('/player/login/dashboard', (req, res) => {
    res.sendFile(__dirname + '/public/html/dashboard.html')
})

app.all('/player/growid/login/validate', (req, res) => {
    const { _token, growId, password } = req.body
    
    if (!_token || !growId || !password) {
        return res.status(400).json({ status: 'error', message: 'Invalid input.' })
    }

    const token = Buffer.from(`_token=${_token}&growId=${growId}&password=${password}`).toString('base64')

    res.json({
        status: "success",
        message: "Account Validated.",
        token,
        url: "",
        accountType: "growtopia"
    })
})

app.post('/player/validate/close', (req, res) => {
    res.send('<script>window.close()</script>')
})

app.get('/', (req, res) => {
    res.send('Welcome to the API')
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(5000, () => {
    console.log('Listening on port 5000')
})
