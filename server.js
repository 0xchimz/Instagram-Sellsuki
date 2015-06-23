var express = require('express');
var serveStatic = require('serve-static');

var app = express();

app.use(serveStatic(__dirname, {
  'setHeaders': setHeaders
}));

app.listen(80);

function setHeaders(res, path) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost/');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
}