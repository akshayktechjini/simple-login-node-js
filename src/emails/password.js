const sendGrid = require('@sendgrid/mail')

sendGrid.setApiKey('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')

const resetPasswordLinkMail = async (resetPasswordLink) => {
  const msg = {
    to: 'akshayachar2011@gmail.com',
    from: 'akshayachar2011@gmail.com',
    subject: 'Reset Password Request',
    html: `You can have requested for the Reset Password. <br> <br><a href=${resetPasswordLink}> Reset Password Link: </a>`
  }
  sendGrid.send(msg)
}

const resetPasswordSuccessMail = async () => {
  const msg = {
    to: 'akshayachar2011@gmail.com',
    from: 'akshayachar2011@gmail.com',
    subject: 'Reset Password Success',
    text: 'You have successfully reset the Password'
  }
  sendGrid.send(msg)
}

const changePasswordSuccessMail = async () => {
  const msg = {
    to: 'akshayachar2011@gmail.com',
    from: 'akshayachar2011@gmail.com',
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
