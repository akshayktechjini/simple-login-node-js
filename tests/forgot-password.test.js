const request = require('supertest')
const app = require('../src/app')
const session = require('supertest-session')
var testSession = null
const { setupDatabase } = require('./fixtures/db')
const User = require('../src/models/user')

beforeEach(function () {
  setupDatabase()
  testSession = session(app)
})

test('Sign Up of the User, Forgot Password, Login, Dashboard Loading', async () => {
  const emailAddress = 'abc8989880134@gmail.com'
  const password = 'Abc1234567'
  const newPassword = 'Aop123789'
  var authenticatedSession
  await request(app)
    .post('/register')
    .send({
      emailAddress,
      password
    }).then(response => {
      expect(response.header.location).toBe('/dashboard')
      expect(response.statusCode).toBe(302)
    })

  await testSession
    .get('/logout')
    .then(response => {
      expect(response.header.location).toBe('/')
      expect(response.statusCode).toBe(302)
    })

  await testSession
    .post('/forgot-password')
    .send({
      emailAddress
    })
    .then(response => {
      expect(response.text).toBe('Reset Password Link has been sent to given Email Address')
    })
  const user = await User.findOne({ emailAddress })
  await testSession
    .get('/reset-password/' + user.token)
    .then(response => {
      expect(response.statusCode).toBe(200)
      authenticatedSession = testSession
    })
  await authenticatedSession
    .post('/reset-password')
    .send({
      password: newPassword
    })
    .then(response => {
      expect(response.statusCode).toBe(200)
    })

  await testSession
    .post('/login')
    .send({
      emailAddress,
      password: newPassword
    })
    .then(async (response) => {
      expect(response.header.location).toBe('/dashboard')
      expect(response.statusCode).toBe(302)
      authenticatedSession = testSession
    })
})
