/*
Sketch:
var data = [];

function setup() {
  createCanvas(400, 400);
  httpGet("https://liveweb.itp.io/", 'json', function(response) {
    for (var i = 0; i < response.length; i++) {
      ellipse(response[i].x, response[i].y, 10,10);
    }
  });
}

function draw() {
  //background(220);
  
  ellipse(mouseX,mouseY,10,10);
  data.push({x: mouseX, y:mouseY});
}

function mousePressed() {
  httpPost("https://liveweb.itp.io/save", 'json', {data: data}, function(result) {
    console.log(result);
  });
}
*/

var datastore = require('nedb');
var db = new datastore({ filename: 'database.json', autoload: true });

var https = require('https');
var fs = require('fs'); // Using the filesystem module

var credentials = {
  key: fs.readFileSync('star_itp_io.key'),
  cert: fs.readFileSync('star_itp_io.pem')
};

var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors());

var bodyParser = require('body-parser');
var urlencodedBodyParser = bodyParser.json({inflate: true, limit: "1000kb"});
app.use(urlencodedBodyParser);

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  db.find({}, function(err, docs) {
    res.send(docs);
  }); 
});

app.post('/save', function (req, res) {
    console.log(req.body);
    console.log(req.body.data);

    db.insert(req.body.data, function (err, newDoc) {
      console.log(newDoc);  
      db.find({}, function(err, docs) {
        res.send(docs);
      });      
    });
});

var httpsServer = https.createServer(credentials, app);

// Default HTTPS Port
httpsServer.listen(443);