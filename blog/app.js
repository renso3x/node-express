const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const multer = require('multer');
const flash = require('connect-flash');
const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');

const routes = require('./routes/index');
const posts = require('./routes/posts');
const categories = require('./routes/categories');

const app = express();

//access global variables in views
app.locals.moment = require('moment');
app.locals.truncate = function(text, length) {
  return text.substring(0, length);
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(multer({dest: './images/uploads'}).any());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//handle express sessions
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));


//validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'), 
      root = namespace.shift(),
      formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//flash messages
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Make our db accessible to our router
app.use(function(req, res, next) {
  req.db = db;
  next();
});


app.use('/', routes);
app.use('/posts', posts);
app.use('/categories', categories);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
