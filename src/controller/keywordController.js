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


// const firebase = require('../firebaseConfig');
// const Twit = require('twit');

// const T = new Twit({
//   consumer_key:         'FDYmsfc1gs07zT22MNRsOXuKI',
//   consumer_secret:      'nhBYAbSg2J1cCDIRoPkngHFXtQ3tiCfUrShjpeobgJrMK4lafx',
//   access_token:         '47931084-wIFqaSrIAl6WQ11dHd0cDim3YuOPD4sT4L2DcULmi',
//   access_token_secret:  'VlOrN9kpFpc20jNQJKZMpBCxFBfkH67huy3bdU9L04UWn',
//   timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
//   strictSSL:            true,     // optional - requires SSL certificates to be valid.
// })

// function getTweetForAnHashtag() {
//     T.get('search/tweets', { q: '@hetic since:2021-03-20', count: 100 }, function(err, data, response) {
//         console.log(data)
//     })
// }

// module.exports = {
//     getTweetForAnHashtag
// };  

// //keyword post
// const keywordPost = async (req, res) => {
//   //const email = req.body.email;
//   //onst password = req.body.password;
//   res.status(200).json({ 'key': 'here you put the keyword' })
// }

//   // if (email === undefined || email === '') {
//   //   res.status(400).json({'error': 'email not found'});
//   // }

//   // if (password === undefined || password === '') {
//   //   res.status(400).json({'error': 'password not found'});
//   // }


// //keyword delete
// const keywordDelete = async (req, res) => {
//   //const email = req.body.email;
//   //onst password = req.body.password;
//   res.status(200).json({ 'key': 'here you put the keyword' })
// }
  
// //keyword get
// const keywordGet = async (req, res) => {
//   res.status(200).json({ 'key': 'here you put the keyword' })
// }

// const keywordGetGraph = async (req, res) => {
//   res.status(200).json({ 'key': 'here you put the keyword' })
// }


// module.exports = {
//   keywordPost,
//   keywordDelete,
//   keywordGet,
//   keywordGetGraph
// }