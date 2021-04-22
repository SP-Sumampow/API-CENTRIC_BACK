/* eslint-disable max-len */
const firebase = require('./firebaseConfig');
require('firebase/auth')


const decodeFirebaseIdToken = async (token) => {
  if (!token) {
    return  {
      payload: null,
      error: 'You did not specify any idToken for this request'
    }
  }

  try {
    // Use firebase-admin auth to verify the token passed in from the client header.
    // This is token is generated from the firebase client
    // Decoding this token returns the userpayload and all the other token claims you added while creating the custom token
    const userPayload = await firebase.client.auth().signInWithCustomToken(token);

    return  {
      payload: userPayload,
      error: null
    }
  } catch (error) {
    return {
      payload: null,
      error: error
    }
  }
};

// Checks if a user is authenticated from firebase admin
const isAuthorized = async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({
      error: {
        message: 'You are not authorised to perform this action. SignUp/Login to continue',
      },
    });
  }
};


module.exports = {
  decodeFirebaseIdToken,
  isAuthorized,
};


