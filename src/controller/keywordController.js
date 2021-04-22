'use strict';
const authMiddleware = require('../auth.middleware.js');
const firebase = require('../firebaseConfig');

const postKeyword = async (req, res) => {
  const keyword = req.body.keyword;
    
  // authentification
  const token = req.cookies.token
  
  if (!token) return res.status(401).send("cookie not found");
  const userpayload = await authMiddleware.decodeFirebaseIdToken(token)
  if (userpayload.error) return res.status(400).json({"error": userpayload.error});
  const user = userpayload.payload.user
  const uid = user.uid
  
  const db = firebase.admin.firestore();
  
  if (keyword === undefined || keyword === '') {
    res.status(400).json({'error': 'keyword not found'});
  }

  console.log("add to firestore the keyword of the user");


  res.status(200).json({ "keyword": keyword});
};

const dataForOneKeyword = async (req, res) => {
  const keyword = req.body.keyword;

// twit api



  res.status(200).json({ "keyword": keyword});
}

module.exports = {
    dataForOneKeyword,
    postKeyword,
};
