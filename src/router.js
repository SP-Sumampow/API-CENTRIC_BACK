'use strict';

const userController = require('./controller/userController');
const keywordController = require('./controller/keywordController');

const init = (app) => {
  // user
  app.post('/user/signUp', userController.signUp);
  app.post('/user/signIn', userController.signIn);
  app.post('/user/logout', userController.logout);
  app.get('/user', userController.getUser);

  //Keyword
  app.post('/keyword', keywordController.postKeyword);

  app.get('/', async (req, res) => {
    res.send('<h1>Projet cloud - Groupe 9 v1.0<h1>')
  });
};

module.exports = {
  init,
};
