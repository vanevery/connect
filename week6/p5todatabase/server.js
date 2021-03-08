// p5 to database
/*
var drawingData = [];

function setup() {
  createCanvas(400, 400);
  httpGet("https://liveweb.itp.io/",'json', function(response) {
    console.log(response);
    for (var i = 0; i < response.length; i++) {
      ellipse(response[i].x, response[i].y, 10, 10);
    }
  });
  
}

function draw() {
  //background(220);
  ellipse(mouseX, mouseY, 10, 10);
  drawingData.push({x: mouseX, y: mouseY});
}

function mousePressed() {
  // Send the data to the server
  // drawingData
  httpPost("https://liveweb.itp.io/save", 'json', drawingData, function(result) {
    console.log("posted");
  });
}
*/

var https = require('https');
var fs = require('fs'); // Using the filesystem module

var credentials = {
  key: fs.readFileSync('star_itp_io.key'),
  cert: fs.readFileSync('star_itp_io.pem')
};

var datastore = require('nedb');
var db = new datastore({ filename: 'database.json', autoload: true });

var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors());

var bodyParser = require('body-parser');
var jsonBodyParser = bodyParser.json({limit: "1000kb"});
app.use(jsonBodyParser);

app.get('/', function(req, res) {
  db.find({}, function(err,docs) {
    res.send(docs);
  });
});

app.post('/save', function(req, res) {
  //console.log(req.body);
  db.insert(req.body, function(err, newDocs) {
    console.log(newDocs);
    res.send();
  });
});

var httpsServer = https.createServer(credentials, app);

// Default HTTPS Port
httpsServer.listen(443);