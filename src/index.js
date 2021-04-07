/* eslint-disable max-len */
'use strict';
const express = require('express');
const router = require('./router');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.use(express.urlencoded({extended: true}));
router.init(app);


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
