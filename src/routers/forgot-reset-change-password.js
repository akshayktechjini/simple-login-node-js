const express = require('express')
const router = express.Router()
const User = require('../models/user')
const mongoose = require('mongoose')
const { resetPasswordLinkMail, resetPasswordSuccessMail, changePasswordSuccessMail } = require('../emails/password')
const { auth } = require('../middleware/auth')

router.get('/forgot-password', (req, res) => {
  res.render('forgot-password')
})

router.post('/forgot-password', async (req, res) => {
  let user = await User.findOne({ emailAddress: req.body.emailAddress })
  if (user) {
    const token = mongoose.Types.ObjectId()
    user.token = token
    user = await user.save()
    const resetPasswordLink = req.protocol + '://' + req.get('host') + '/reset-password/' + token
    resetPasswordLinkMail(resetPasswordLink, user.emailAddress)
  }
  res.send('Reset Password Link has been sent to given Email Address')
})

router.get('/reset-password/:token', async (req, res) => {
  req.session.token = req.params.token
  const user = await User.findOne({ token: req.params.token })
  if (user) {
    res.render('reset-password')
  } else {
    res.render('login', {
      errorMessage: 'Reset Password Link has expired. Please request once again'
    })
  }
})

router.post('/reset-password', async (req, res) => {
  const user = await User.findOne({ token: req.session.token })
  if (user) {
    user.password = await req.body.password
    await user.save()
    delete req.session.token
    await resetPasswordSuccessMail(user.emailAddress)
    res.render('login', {
      successMessage: 'Password has been reset successfully. Login now'
    })
  } else {
    res.render('login', {
      errorMessage: 'Unable to Reset the Password. Please try once again'
    })
  }
})

router.get('/change-password', auth, (req, res) => {
  res.render('change-password')
})

router.post('/change-password', auth, async (req, res) => {
  const currentPassword = req.body.currentPassword
  const user = await User.findById(req.user._id)
  const passwordValid = await user.passwordValid(currentPassword)
  if (passwordValid) {
    user.password = req.body.newPassword
    await user.save()
    changePasswordSuccessMail(user.emailAddress)
    res.locals.successMessage = 'Password Changed Successfully'
    res.redirect('/login')
  } else {
    res.render('change-password', {
      errorMessage: 'Current Password Not Matching'
    })
  }
})

module.exports = router
