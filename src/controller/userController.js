'use strict';
const firebase = require('../firebaseConfig');

const signIn = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === undefined || email === '') {
    res.status(400).json({'error': 'email not found'});
  }

  if (password === undefined || password === '') {
    res.status(400).json({'error': 'password not found'});
  }

  await firebase
      .auth()
      .createUser({
        email: email,
        emailVerified: true,
        password: password,
      })
      .then(async (userRecord) => {
        const db = firebase.firestore();
        await db.collection('users').doc(userRecord.uid).set({
          email: userRecord.email,
          isSubscribed: false,
        });
        res.status(200).json(userRecord);
      })
      .catch((error) => {
        console.log(error);
        res.status(406).json(error);
      });
};

module.exports = {
  signIn,
};
