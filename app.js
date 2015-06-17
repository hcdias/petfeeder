var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var redis = require('redis');
var session = require('express-session');
var redisStore = require('connect-redis')(session);

//rotas
var index = require('./routes/index');
var login = require('./routes/login');
var cadastro = require('./routes/cadastro');
var artefato = require('./routes/modulos/artefato');
var laser = require('./routes/modulos/laser');
var som = require('./routes/modulos/som');
var dispenser = require('./routes/modulos/dispenser');

var app = express();
var client = redis.createClient();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'codigo',store:new redisStore(),saveUninitialized: false,resave: false}));

app.use(function(req,res,next){
  res.locals.session = req.session;
  next();
});


//rotas
app.use('/',login);

app.use('/index', index);

app.use('/cadastro',cadastro);

app.use('/modulo-artefato',artefato);

app.use('/modulo-laser',laser);

app.use('/modulo-som',som);

app.use('/dispenser',dispenser);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
