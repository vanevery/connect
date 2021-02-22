var express = require('express');
var app = express();
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World! Here is another change!');
});

app.listen(80, function () {
  console.log('Example app listening on port 80!');
});