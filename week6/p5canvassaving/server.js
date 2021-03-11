// p5 to database
/*
let c;

function setup() {
  c = createCanvas(400, 400);
}

function draw() {
  //background(220);
  ellipse(mouseX,mouseY,10,10);
}

function mousePressed() {
  // P5 canvas is HTML 5 Canvas
  let canvasString = c.elt.toDataURL();
  console.log(canvasString);
  httpPost(
    "https://localhost.itp.io/canvas",
    'json',
    {canvas: canvasString},
    function(result) {
      console.log(result);
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

app.post('/canvas', function(req, res) {
  console.log(req.body.canvas);
  var data = req.body.canvas;

// Saving a data URL (server side)
var searchFor = "data:image/png;base64,";
var strippedImage = data.slice(data.indexOf(searchFor) + searchFor.length);
var binaryImage = new Buffer(strippedImage, 'base64');
fs.writeFileSync(__dirname + '/' + Date.now() + '.jpg', binaryImage);

res.send("Thanks");

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