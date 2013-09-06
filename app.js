/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  everyauth = require('everyauth');
var app = express();

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser('raosee'));
  app.use(express.session());
  app.use(app.router);
  app.use(everyauth.middleware(app));
});

everyauth.helpExpress(app);

/*app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});*/

/*app.configure('production', function() {
  app.use(express.errorHandler());
});*/

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API

app.get('/api/posts', api.posts);

app.get('/api/post/:id', api.post);
app.post('/api/post', api.feature.addPost);
app.put('/api/post/:id', api.editPost);
app.delete('/api/post/:id', api.deletePost);

app.get('/api/status', api.status.list);
app.post('/api/status', api.status.add);

app.get('/api/todo', api.todo.list);
app.post('/api/todo', api.todo.add);
// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(8001, function() {
  console.log("Express server listening on port %d in %s mode", 8001, app.settings.env);
});