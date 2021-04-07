'use strict';

const userController = require('./controller/userController');

const init = (app) => {
  // user
  app.post('/user/signIn', userController.signIn);
};

module.exports = {
  init,
};
