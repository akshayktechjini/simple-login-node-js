const request = require('supertest')
const app = require('../src/app')
const { setupDatabase } = require('./fixtures/db')

beforeEach(function () {
  setupDatabase()
})

test('Sign Up of the User Succesfully', async () => {
  await request(app)
    .post('/register')
    .send({
      emailAddress: 'abc@gmail.com',
      password: 'Abc1234567'
    }).then(response => {
      expect(response.header.location).toBe('/dashboard')
      expect(response.statusCode).toBe(302)
    })
})

test('Sign Up of the User Failed', async () => {
  await request(app)
    .post('/register')
    .send({
      emailAddress: 'abc@gmail.com',
      password: 'a'
    }).then(response => {
      expect(response.statusCode).toBe(200)
    })
})
