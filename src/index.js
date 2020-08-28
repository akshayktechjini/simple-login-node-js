const express = require('express')
const session = require('express-session')
const path = require('path')
const app = express()
require('./db/mongoose')
const { auth } = require('./middleware/auth')
const registrationRouters = require('./routers/registration.js')
const loginRouters = require('./routers/login.js')

const PORT = process.env.PORT

const viewsPath = path.join(__dirname, '../template/views')

app.set('view engine', 'hbs')

app.set('views', viewsPath)
app.use(express.urlencoded({ extended: false }))

app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
}))

app.use(registrationRouters)
app.use(loginRouters)

app.get('/', (req, res) => {
  res.render('homepage')
})

app.get('/dashboard', auth, (req, res) => {
  res.render('dashboard', {
    emailAddress: req.session.user.emailAddress
  })
})

app.get('*', (req, res) => {
  res.status(404).send('Page Not Found')
})

app.listen(PORT, () => {
  console.log('Server listening at ' + PORT)
})