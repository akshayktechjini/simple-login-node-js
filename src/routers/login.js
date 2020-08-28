const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.emailAddress, req.body.password)
    if (user) {
      req.session.user = user
      res.redirect('/dashboard')
    }
  } catch (e) {
    res.render('login', {
      errorMessage: 'Unable to Login'
    })
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
})

module.exports = router
