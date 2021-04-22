const admin = require('firebase-admin');
const firebaseKey = require('./firebaseKey.json');
const firebaseClientKey = require('./firebaseClientKey.json');
const firebase = require("firebase/app");
const configClient = firebaseClientKey

module.exports =  {
 admin: admin.initializeApp({
    credential: admin.credential.cert(firebaseKey),
    databaseURL: 'https://api-centric-web2.europe-west.firebasedatabase.app',
  }),
  client: firebase.initializeApp(configClient)
}


