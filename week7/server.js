// https://developers.facebook.com/docs/graph-api
// https://developers.facebook.com/apps/
// Settings: 
// Login Settings: https://developers.facebook.com/apps/273006067790025/fb-login/settings/
// https://developers.facebook.com/docs/facebook-login/permissions
// /me/photos
// Create APP


// Facebook API module: http://criso.github.io/fbgraph/
var graph = require('fbgraph');

// HTTPS Module
var https = require('https');

// Express
var express = require('express');
var app = express();

var fs = require('fs');

// Settings
var keys = require(__dirname + '/keys.js');

// Facebook Settings from Keys
var fb_appID = keys.fb_appID;
var fb_secret = keys.fb_secret;
var fb_scope = keys.fb_scope;

// Facebook Access Token from OAuth
var access_token = "";

// OAuth Paths and URLs
const loginRedirectPath = "/loggedin";
const loginRedirectUrl = "https://liveweb.itp.io" + loginRedirectPath;
console.log(loginRedirectUrl);

var options = {
	key: fs.readFileSync("star_itp_io.key"),
	cert: fs.readFileSync("star_itp_io.pem")
};

var httpsServer = https.createServer(options, app);
httpsServer.listen(443);
console.log("Visit: /auth to perform Facebook OAuth and kick the access off");

// get FB authorization url
var authUrl = graph.getOauthUrl({
	"client_id": fb_appID
	, "redirect_uri": loginRedirectUrl
	, "scope": fb_scope
});

console.log(authUrl);

// Privacy policy and such for FB
app.get("/", function(req, res) {
    res.send("General Info");
});

// Redirect to FB's authorization URL
app.get("/auth", function(req, res) {
    res.writeHead(301, {'Location': authUrl});
    res.end();
});

// Users will get redirected back here when they are logged in
app.get("/loggedin", function(req,res) {

    // Authorize the graph API
    graph.authorize({
        "client_id":      fb_appID
        , "redirect_uri":   loginRedirectUrl
        , "client_secret":  fb_secret
        , "code":           req.query.code
    }, function (err, facebookRes) {

        if (err) console.log(err);
        
        // Extend access token
        graph.extendAccessToken({
            "access_token":    facebookRes.access_token
        , "client_id":      fb_appID
        , "client_secret":  fb_secret
        }, function (err, facebookRes) {
            if (err) console.log(err);

            // Set the access token
            graph.setAccessToken(facebookRes.access_token);

            doSomething(res);
        });
    });
});		

function doSomething(httpRes) {

    var response = "";

    // Get the user's feed
    graph.get("me", { fields: "id,name,gender,link,picture"}, function(err, res) {
        if (err) console.log(err);

        response = JSON.stringify(res);
        httpRes.send(response);
        
    });

}