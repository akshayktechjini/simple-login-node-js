const sendGrid = require('@sendgrid/mail')

sendGrid.setApiKey('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')

const registrationSuccessMail = async () => {
  const msg = {
    to: 'akshayachar2011@gmail.com',
    from: 'akshayachar2011@gmail.com',
    subject: 'Registration Success',
    text: 'You have successfully Registered'
  }
  sendGrid.send(msg)
}

module.exports = {
  registrationSuccessMail
}
