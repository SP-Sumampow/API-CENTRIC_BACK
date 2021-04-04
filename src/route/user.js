
const login = (req, res) => {
  res.json('coucou');
};

module.exports = {
  init: (app) => {
    app.get('/', login);
  },
};
