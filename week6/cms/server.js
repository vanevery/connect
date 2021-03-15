var datastore = require('nedb');
var db = new datastore({ filename: 'database.json', autoload: true });

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var urlencodedBodyParser = bodyParser.urlencoded({extended: true});
app.use(urlencodedBodyParser);

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {

  db.find({}).sort({timestamp: 1}).exec(function(err, docs) {
    var dataWrapper = {data: docs};
    if (typeof req.query.editor != "undefined") {
      dataWrapper.editor = true;
    } else {
      dataWrapper.editor = false;
    }
    res.render("outputtemplate.ejs",dataWrapper);
  });      
});

app.get('/displaypage', function (req, res) {
  db.find({_id: req.query._id}, function(err, docs) {
    var dataWrapper = {data: docs[0]};
    res.render("individual.ejs", dataWrapper);
  });
});

app.get('/search', function(req, res) {
  // /search?q=text to search for
  console.log("Search for: " + req.query.q);
  var query = new RegExp(req.query.q, 'i');
  db.find({maincontent: query}, function(err, docs) {
    var dataWrapper = {data: docs, search: req.query.q};
    res.render("outputtemplate.ejs",dataWrapper);
  })
});

app.get('/newpage', function(req,res) {
  var dataWrapper = {data: {title: "", maincontent: "", _id: -1}};
  if (typeof req.query._id != "undefined") {
    db.find({_id: req.query._id}, function(err, docs) {
      dataWrapper = {data: docs[0]};
      res.render("newpage.ejs",dataWrapper);
    });    
  } else {
    res.render("newpage.ejs",dataWrapper);
  }

});

app.get('/deletepage', function (req, res) {
  if (typeof req.query._id != "undefined") {
    db.remove({_id: req.query._id}, {}, function(err,docs){
      res.redirect('/?editor');
    });
  }
});

app.post('/newpage', function (req, res) {

    var dataToSave = {
      title: req.body.title,
      maincontent: req.body.maincontent,
      timestamp: Date.now()
    };

    if (typeof req.body._id != "undefined") {
      db.update({_id: req.body._id}, dataToSave, {returnUpdatedDocs: true}, function(err, num, newDoc, upcert) {
        console.log(err);
        console.log(num);
        console.log(newDoc);
        res.redirect("/?editor");
      });
    } else {
      db.insert(dataToSave, function (err, newDoc) {  
        res.redirect("/?editor");
      });
    }
});

app.listen(80, function () {
  console.log('Example app listening on port 80!');
});