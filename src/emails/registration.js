const sendGrid = require('@sendgrid/mail')

sendGrid.setApiKey(process.env.SENDGRID_API_KEY)

const registrationSuccessMail = async (to) => {
  if (process.env.NODE_ENV !== 'production') {
    to = process.env.TO_TEST_EMAIL
  }
  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject: 'Registration Success',
    text: 'You have successfully Registered'
  }
  sendGrid.send(msg)
}

module.exports = {
  registrationSuccessMail
}
