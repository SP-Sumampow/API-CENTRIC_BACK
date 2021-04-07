const admin = require('firebase-admin');
const firebaseKey = require('../confs/firebaseKey.json');

module.exports = admin.initializeApp({
  credential: admin.credential.cert(firebaseKey),
  databaseURL: 'https://api-centric-web2.europe-west.firebasedatabase.app',
});
