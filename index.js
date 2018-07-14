require('dotenv').config()
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const serviceAccount = {
  private_key: process.env.private_key.replace(/\\n/g, '\n'),
  client_email: `${process.env.client_email}`
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://envoy-carwash.firebaseio.com'
})

app = express()
// app.use('*', cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', CLIENT_ORIGIN)
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})
app.use(bodyParser.json())

const port = process.env.PORT || 4000

app.post('/setCustomClaims', (req, res) => {
  const data = req.body

  admin
    .auth()
    .setCustomUserClaims(data.uid, { admin: true })
    .then(() => {
      // The new custom claims will propagate to the user's ID token the
      // next time a new one is issued.
      res.json({
        success: true
      })
    })
    .catch(error => {
      res.json({
        success: false
      })
    })
})

app.listen(port, function(err) {
  if (err) {
    console.log(err)
  }

  console.log('listening in http://localhost:' + port)
})
