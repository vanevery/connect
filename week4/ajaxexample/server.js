// Ajax example

var datastore = require('nedb');
var db = new datastore({ filename: 'database.json', autoload: true });

var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/formdata', function (req, res) {
    console.log(req.query.text);

    var dataToSave = {
      text: req.query.text,
      color: req.query.color
    };

    db.insert(dataToSave, function (err, newDoc) {  
      db.find({}, function(err, docs) {
    
        //var dataWrapper = {data: docs};
        //res.render("outputtemplate.ejs",dataWrapper);
  
        res.send(docs);
      });      
    });

    
});

app.listen(80, function () {
  console.log('Example app listening on port 80!');
});