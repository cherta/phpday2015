var browserify = require('browserify-middleware');
var express = require('express');
var app = express();
var talksData = require('./talks');

browserify.settings({
  transform: ['brfs', 'babelify']
});

app.set('port', (process.env.PORT || 5000));

app.use('/app.js', browserify('client/scripts/main.js'));

app.use(express.static('node_modules'));
app.use(express.static('client'));

app.get('/talks', function (req, res) {
  res.send(talksData);
});

app.get('/talks/:id', function (req, res) {
  var id = Number(req.params.id);
  var talk = talksData.filter( function (talk) {
    return talk.id === Number(id);
  })[0];
  res.send(talk);
});

var server = app.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
