const request = require('supertest')
const app = require('../src/app')
const session = require('supertest-session')
var testSession = null
const { setupDatabase } = require('./fixtures/db')

beforeEach(function () {
  setupDatabase()
  testSession = session(app)
})

test('Sign Up of the User and Login', async () => {
  const emailAddress = 'abc122@gmail.com'
  const password = 'Abc1234567'
  await request(app)
    .post('/register')
    .send({
      emailAddress,
      password
    }).then(response => {
      expect(response.header.location).toBe('/dashboard')
      expect(response.statusCode).toBe(302)
    })

  await request(app)
    .post('/login')
    .send({
      emailAddress,
      password
    })
    .then(async (response) => {
      expect(response.header.location).toBe('/dashboard')
      expect(response.statusCode).toBe(302)
    })

  await request(app)
    .post('/login')
    .send({
      emailAddress,
      password: 'djgjhg'
    })
    .then(response => {
      expect(response.header.location).toBeUndefined()
      expect(response.statusCode).toBe(200)
    })
})

test('Sign Up of the User, Login, Dashboard Loading and Logout', async () => {
  const emailAddress = 'abc8989@gmail.com'
  const password = 'Abc1234567'
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
    .get('/logout')
    .then(response => {
      expect(response.header.location).toBe('/')
      expect(response.statusCode).toBe(302)
    })
})

test('Sign Up of the User, Failed Login and Dashboard Redirecting to Login', async () => {
  const emailAddress = 'abc1290@gmail.com'
  const password = 'Abc1234567'
  var authenticatedSession
  await request(app)
    .post('/register')
    .send({
      emailAddress,
      password
    }).then(response => {
      expect(response.statusCode).toBe(302)
    })

  await testSession
    .post('/login')
    .send({
      emailAddress,
      password: 'ghdg'
    })
    .then(async (response) => {
      expect(response.statusCode).toBe(200)
      authenticatedSession = testSession
    })

  await authenticatedSession
    .get('/dashboard')
    .then(response => {
      expect(response.header.location).toBe('/login')
      expect(response.statusCode).toBe(302)
    })
})
