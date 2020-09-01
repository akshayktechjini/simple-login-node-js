const sendGrid = require('@sendgrid/mail')

sendGrid.setApiKey(process.env.SENDGRID_API_KEY)

const resetPasswordLinkMail = async (resetPasswordLink, to) => {
  if (process.env.NODE_ENV !== 'production') {
    to = process.env.TO_TEST_EMAIL
  }
  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject: 'Reset Password Request',
    html: `You can have requested for the Reset Password. <br> <br><a href=${resetPasswordLink}> Reset Password Link: </a>`
  }
  sendGrid.send(msg)
}

const resetPasswordSuccessMail = async (to) => {
  if (process.env.NODE_ENV !== 'production') {
    to = process.env.TO_TEST_EMAIL
  }
  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject: 'Reset Password Success',
    text: 'You have successfully reset the Password'
  }
  sendGrid.send(msg)
}

const changePasswordSuccessMail = async (to) => {
  if (process.env.NODE_ENV !== 'production') {
    to = process.env.TO_TEST_EMAIL
  }
  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject: 'Change Password Success',
    text: 'You have successfully Changed the Password'
  }
  sendGrid.send(msg)
}

module.exports = {
  resetPasswordLinkMail,
  resetPasswordSuccessMail,
  changePasswordSuccessMail
}
