// require('dotenv-json')()
require('dotenv').config()
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const compression = require('compression')

const serviceAccount = {
  type: 'service_account',
  project_id: 'envoy-carwash',
  private_key_id: `${process.env.private_key_id}`,
  private_key: `${process.env.private_key}`,
  client_email: `${process.env.client_email}`,
  client_id: `${process.env.client_id}`,
  auth_uri: `${process.env.auth_uri}`,
  token_uri: `${process.env.token_uri}`,
  auth_provider_x509_cert_url: `${process.env.auth_provider_x509_cert_url}`,
  client_x509_cert_url: `${process.env.client_x509_cert_url}`
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://envoy-carwash.firebaseio.com'
})

app = express()
app.use(compression())
app.use(bodyParser.json())
app.use(cors())
app.options('*', cors())

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
