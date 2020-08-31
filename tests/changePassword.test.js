const request = require('supertest')
const app = require('../src/app')
const session = require('supertest-session')
var testSession = null
const { setupDatabase } = require('./fixtures/db')

beforeEach(function () {
  setupDatabase()
  testSession = session(app)
})

test('Sign Up of the User, Login, Dashboard Loading and Change Password Success', async () => {
  const emailAddress = 'abc898944444@gmail.com'
  const password = 'Abc1234567'
  const newPassword = 'hfgjhg12333'
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
    .post('/login')
    .send({
      emailAddress,
      password
    })
    .then(async (response) => {
      expect(response.header.location).toBe('/dashboard')
      expect(response.statusCode).toBe(302)
      authenticatedSession = testSession
    })

  await authenticatedSession
    .get('/dashboard')
    .then(response => {
      expect(response.statusCode).toBe(200)
    })

  await authenticatedSession
    .post('/change-password')
    .send({
      currentPassword: password,
      newPassword
    })
    .then(response => {
      expect(response.header.location).toBe('/login')
      expect(response.statusCode).toBe(302)
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

test('Sign Up of the User, Login, Dashboard Loading and Change Password Failed', async () => {
  const emailAddress = 'abc89894454@gmail.com'
  const password = 'Abc12345670'
  const newPassword = 'hfgjhg125333'
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
    .post('/login')
    .send({
      emailAddress,
      password
    })
    .then(async (response) => {
      expect(response.header.location).toBe('/dashboard')
      expect(response.statusCode).toBe(302)
      authenticatedSession = testSession
    })

  await authenticatedSession
    .get('/dashboard')
    .then(response => {
      expect(response.statusCode).toBe(200)
    })

  await authenticatedSession
    .post('/change-password')
    .send({
      currentPassword: newPassword,
      newPassword
    })
    .then(response => {
      expect(response.header.location).toBeUndefined()
      expect(response.statusCode).toBe(200)
    })

  await testSession
    .post('/login')
    .send({
      emailAddress,
      password: newPassword
    })
    .then(async (response) => {
      expect(response.header.location).toBeUndefined()
      expect(response.statusCode).toBe(200)
      authenticatedSession = testSession
    })

  await testSession
    .post('/login')
    .send({
      emailAddress,
      password
    })
    .then(async (response) => {
      expect(response.header.location).toBe('/dashboard')
      expect(response.statusCode).toBe(302)
      authenticatedSession = testSession
    })
})
