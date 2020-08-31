const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  emailAddress: {
    type: String,
    required: true,
    unique: true,
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
  },
  token: {
    type: String
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

userSchema.methods.passwordValid = async function (password) {
  const user = this
  return await bcrypt.compare(password, user.password)
}

userSchema.plugin(uniqueValidator, { message: '{PATH} already registered' })

const User = mongoose.model('user', userSchema)

module.exports = User
