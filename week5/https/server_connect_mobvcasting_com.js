var https = require('https');
var fs = require('fs'); // Using the filesystem module

var credentials = {
  key: fs.readFileSync('/etc/letsencrypt/live/connect.mobvcasting.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/connect.mobvcasting.com/cert.pem')
};

// Start Normal Express Code
var express = require('express');
var app = express();

app.get('/', function(req, res) {
	res.send("Hello World!");
});
/////

var httpsServer = https.createServer(credentials, app);

// Default HTTPS Port
httpsServer.listen(443);