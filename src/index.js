/* eslint-disable max-len */
'use strict';
const express = require('express');
const router = require('./router');
const cookieParser = require("cookie-parser");

// Constants
const PORT = process.env.PORT || 8080;
const app = express();

app.use(cookieParser());

app.use(express.urlencoded({extended: true}));
router.init(app);


app.listen(PORT, () => {
  console.log('API-CENTRIC_BACK listening on port', PORT);
});