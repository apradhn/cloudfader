var express = require('express');
var app = express();

app.set('view engine', 'jade');

app.use(express.static('public'));

app.use(express.static('bower_components'));

app.get('/', function(req, res) {
	res.render('index');
});

app.listen(3000, function() {
	console.log('CloudFader app listening on port 3000!');
});
