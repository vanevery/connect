var express = require('express');

// Require cookie-parser
var cookieParser = require('cookie-parser');

var app = express();

// Use the cookieParser middleware
app.use(cookieParser());

// Use middleware to read/set the cookies
app.use(function (req, res, next) {
	
	console.log(req.cookies);

	// Variable per request to keep track of visits
	var visits = 1;
	
	// If they have a "visits" cookie set, get the value and add 1 to it
	if (req.cookies.visits) {
		visits = Number(req.cookies.visits) + 1;
	}
	
	// Set the new or updated cookie
	res.cookie('visits', visits, {});
	next();
  })

// Static pages
app.use(express.static("public"));

// Just for fun
app.get('/', function (req, res) {
	res.send("hi dynamic");
});

app.listen(8080);	