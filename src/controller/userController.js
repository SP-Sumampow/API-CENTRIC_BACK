'use strict';
const firebase = require('../firebaseConfig');
const authMiddleware = require('../auth.middleware.js');

const signUp = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === undefined || email === '') {
    res.status(400).json({'error': 'email not found'});
  }

  if (password === undefined || password === '') {
    res.status(400).json({'error': 'password not found'});
  }

  await firebase.admin
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

const signIn = async (req, res) => {
  const uid = req.body.uid;


  if (uid === undefined || uid === '') {
    res.status(400).json({'uid': 'uid not found'});
  }

  firebase.admin
    .auth()
    .createCustomToken(uid)
    .then((customToken) => {

      res.writeHead(200, {
        "Set-Cookie": `token=${customToken}; HttpOnly`,
        "Access-Control-Allow-Credentials": "true"
      })
      .send();

    })
    .catch((error) => {
      console.log('Error creating custom token:', error);
      res.status(406).json(error);
    });
};

const getUser = async (req, res) => {
  // authentification
  const token = req.cookies.token
  if (!token) return res.status(401).send("cookie not found");
  const userpayload = await authMiddleware.decodeFirebaseIdToken(token)
  if (userpayload.error) return res.status(400).json({"error": userpayload.error});
  const user = userpayload.payload.user
  const uid = user.uid

  //const user = req.body.user;
  res.status(200).json(user);  
};

  const logout = async (req, res) => {
  // authentification
  const token = req.cookies.token
  if (!token) return res.status(401).send("cookie not found");
  const userpayload = await authMiddleware.decodeFirebaseIdToken(token)
  if (userpayload.error) return res.status(400).json({"error": userpayload.error});

  res.writeHead(200, {
    "Set-Cookie": `token=null; HttpOnly`,
    "Access-Control-Allow-Credentials": "true"
  })
  .send();
};


module.exports = {
  signUp,
  signIn,
  getUser,
  logout
};
