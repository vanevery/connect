var express = require('express');
var app = express();

var http = require('http');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/weatherdata', function(req, res) {
    /*
    fetch('http://api.openweathermap.org/data/2.5/weather?units=imperial&q='+city+'&appid=d21e79452f4461671f1ccf2a209d48c3')
                        .then(response => response.json())
                        .then(data => handleWeatherData(data));
    */

    var city = req.query.city;

   var requestOptions = {
        host: 'api.openweathermap.org',
        path: '/data/2.5/weather?units=imperial&q='+city+'&appid=YOUR API KEY HERE'
    };

    function requestCallback(response) {
        var str = "";
        response.on('data', function(chunk) {
            str = str + chunk;
        });
        response.on('end', function() {
            console.log(str);
            res.send(str);
        })
    }

    http.request(requestOptions, requestCallback).end();


});

app.listen(80, function () {
  console.log('Example app listening on port 80!');
});