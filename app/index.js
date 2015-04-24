// # index.js
// This app is built with Express for easy routing and templating
var express = require('express');
var app = express();

// `path` is used to create filepaths
var path = require('path');

// Check for a port in the ENV before setting one manually
app.set('port', process.env.PORT || 3000);

// Views are written using Jade templates
app.set('views', path.join(__dirname, 'server/views/'));
app.set('view engine', 'jade');

// - Create a default title
app.title = 'Supercharge Your Front-End Workflow';

// - To save the hassle of initializing a database, hard code some blog entries
app.blogs = [
  {
    title: 'Keffiyeh raw denim sustainable',
    image: '/img/blog-image01.jpg',
    excerpt: 'Cray four loko gentrify, High Life Echo Park disrupt ' +
             'paleo Shoreditch Neutra put a bird on it tilde occupy ' +
             'cardigan wolf keytar. Artisan YOLO trust fund meditation ' +
             'literally PBR.',
    permalink: '/blog/post-one/'
  },
  {
    title: 'Intelligentsia wayfarers iPhone',
    image: '/img/blog-image02.jpg',
    excerpt: 'Gluten-free trust fund sartorial pork belly literally. ' +
             'Yr hoodie swag, cornhole salvia gastropub locavore next ' +
             'level iPhone fingerstache. PBR&B disrupt High Life, ' +
             'locavore drinking vinegar meggings mlkshk 3 wolf moon.',
    permalink: '/blog/post-two/'
  },
  {
    title: 'Art party Brooklyn listicle',
    image: '/img/blog-image03.jpg',
    excerpt: 'Heirloom banh mi narwhal chambray. Neutra Echo Park ' +
             'flannel, health goth pug keytar Blue Bottle chia art ' +
             'party pickled twee Vice. Plaid photo booth next level ' +
             'sriracha hoodie gastropub, gluten-free Carles freegan.',
    permalink: '/blog/post-three/'
  }
];

// The default route loads the home page.
app.get('/', function( req, res ) {
  res.render('index', { title: app.title, blogs: app.blogs });
});

// To keep things simple, sub-pages are required to be letters only.
app.get('/(([a-z]+))/', function( req, res) {

  // - Store the page name from the URL
  var page = req.params[0];

  // - Create a capitalized version of the page for the title
  var title = page.charAt(0).toUpperCase() + page.slice(1) + ' | ' + app.title;

  // - Create a hash of variables to send to the template
  var templateVars = {
    title: title // - The title is required for all templates
  };

  // - For the blog page, add the blog posts to the template variables
  if (page==='blog') {
    templateVars.blogs = app.blogs;
  }

  // - Render the template
  res.render(page, templateVars, function (err, html) {
    if (err) {
      //   - If the template doesn't exist, send a 404
      res.redirect('/404/');
    } else {
      //   - Otherwise, render the template as expected
      res.end(html);
    }
  });
});

// For blog posts, we use the slug to identify the post.
// However, to keep this app front-end only, we're using hard-coded content.
app.get('/blog/:slug/', function( req, res ) {

  var slug = req.params.slug,
      post = {};

  // - Loop through the blog posts to find the one matching the slug
  app.blogs.some(function( blog ) {
    var permalink = '/blog/' + slug + '/';
    if (blog.permalink===permalink) {
      post = blog;
    }
  });

  res.render('single', post, function( err, html) {
    if (err) {
      res.redirect('/404/');
    } else {
      res.end(html);
    }
  });

});

// Static files are all stored in the `public` dir
app.use(express.static(path.join(__dirname, 'public')));

// If something goes wrong with the server, send a simple message
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Add 404 handling for pages that don't exist
app.use(function(req, res, next) {
  res.status(404).send("The page you requested doesn't exist.");
});

// Start the app on port 3000
var server = app.listen(app.get('port'), function(  ) {
  console.log('App started and listening on port %s', server.address().port);
});
