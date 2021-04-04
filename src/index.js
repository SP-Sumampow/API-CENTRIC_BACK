'use strict';

const express = require('express');
const routeUser = require('./route/user');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

routeUser.init(app);


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);