const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = mongoose.Schema({
  emailAddress: {
    type: String,
    required: true,
    validate (value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email address is not valid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7
  }
}, {
  timestamps: true
})

userSchema.statics.findByCredentials = async (emailAddress, password) => {
  const user = await User.findOne({ emailAddress })
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      return user
    }
  }
  throw new Error('Unable to Login !')
}

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

const User = mongoose.model('user', userSchema)

module.exports = User
