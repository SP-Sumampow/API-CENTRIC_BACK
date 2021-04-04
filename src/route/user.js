const login = (req, res) => {
  res.json('login');
};

const logout = (req, res) => {
  res.json('logout');
};

module.exports = {
  init: (app) => {
    app.get('/login', login);
    app.get('/logout', logout);
  },
};
