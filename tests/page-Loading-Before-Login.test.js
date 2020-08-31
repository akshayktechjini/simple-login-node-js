const request = require('supertest')
const app = require('../src/app')

test('HomePage Page Loading', async () => {
  await request(app)
    .get('/')
    .then(response => {
      expect(response.statusCode).toBe(200)
    })
})

test('Login Page Loading', async () => {
  await request(app)
    .get('/login')
    .then(response => {
      expect(response.statusCode).toBe(200)
    })
})

test('Sign Up Page Loading', async () => {
  await request(app)
    .get('/sign-up')
    .then(response => {
      expect(response.statusCode).toBe(200)
    })
})

test('Forgot Password Page Loading', async () => {
  await request(app)
    .get('/forgot-password')
    .then(response => {
      expect(response.statusCode).toBe(200)
    })
})

test('Dashboard Page Redirecting to Login Page before Login', async () => {
  await request(app)
    .get('/dashboard')
    .then(response => {
      expect(response.statusCode).toBe(302)
      expect(response.header.location).toBe('/login')
    })
})

test('Logout Page Redirecting  to Login Page before Login', async () => {
  await request(app)
    .get('/logout')
    .then(response => {
      expect(response.statusCode).toBe(302)
      expect(response.header.location).toBe('/')
    })
})

test('Change Password Page Redirecting  to Login Page before Login', async () => {
  await request(app)
    .get('/change-password')
    .then(response => {
      expect(response.statusCode).toBe(302)
      expect(response.header.location).toBe('/login')
    })
})

test('Not Defined Route Should give 404 Status', async () => {
  await request(app)
    .get('/test')
    .then(response => {
      expect(response.statusCode).toBe(404)
    })
})
