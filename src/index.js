const app = require('./app')
console.log(process.env.NODE_ENV)
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log('Server listening at ' + PORT)
})
