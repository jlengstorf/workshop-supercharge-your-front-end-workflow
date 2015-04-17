// # Supercharge Your Front-End Workflow

// This app is built with Express for easy routing and templating
var express = require('express');
var app = express();

// `path` is used to create filepaths
var path = require('path');

// Views are written using Jade templates
app.set('views', path.join(__dirname, 'server/views/'));
app.set('view engine', 'jade');

// The default route loads the home page
app.get('/', function( req, res ) {
    res.render('index', { title: 'Home' });
});

// Static files are all stored in the `public` dir
app.use(express.static(path.join(__dirname, 'public')));

// For now, the app listens on port 3000
var server = app.listen(3000, function(  ) {
    console.log('App started and listening on port %s', server.address().port);
});
