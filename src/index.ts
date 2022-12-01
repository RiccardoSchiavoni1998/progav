
import express = require('express');
const app = express();

var routesHandler = require('./routesHandler');

app.use('/', routesHandler);
 
app.listen(8080, () => console.log(`App server listening on port 8080`));



