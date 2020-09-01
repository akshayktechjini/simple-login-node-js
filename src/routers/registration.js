const express = require('express')
const router = express.Router()
const User = require('../models/user')
const { registrationSuccessMail } = require('../emails/registration')

router.get('/sign-up', (req, res) => {
  res.render('sign-up')
})

router.post('/register', async (req, res) => {
  try {
    const user = await new User(req.body)
    await user.save()
    req.session.user = user
    registrationSuccessMail(user.emailAddress)
    res.redirect('/dashboard')
  } catch (e) {
    let emailAddressErrorMessage = ''
    let passwordErrorMessage = ''
    if (e.errors.emailAddress) {
      emailAddressErrorMessage = e.errors.emailAddress.message
    }
    if (e.errors.password) {
      passwordErrorMessage = e.errors.password.message
    }
    res.locals.emailAddressErrorMessage = emailAddressErrorMessage
    res.locals.passwordErrorMessage = passwordErrorMessage
    res.render('sign-up')
  }
})

module.exports = router
