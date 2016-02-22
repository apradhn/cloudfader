var express = require('express');
var app = express();

app.set('view engine', 'jade');

app.use(express.static('public'));

app.use(express.static('bower_components'));

app.get('/', function(req, res) {
	res.render('index');
});

app.listen(process.env.PORT || 5000, function() {
	console.log('CloudFader app started!');
});
