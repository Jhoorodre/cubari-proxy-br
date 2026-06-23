const express = require('express');
const setupProxy = require('./src/setupProxy.js');
const app = express();
setupProxy(app);
app.listen(3001, () => console.log('Test proxy running on 3001'));
