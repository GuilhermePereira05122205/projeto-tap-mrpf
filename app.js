var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var crypt = require("crypto")
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var servicosRouter = require('./routes/services');
var session = require("express-session")
var http = require("http")
var app = express();
var { create } = require("express-handlebars");
const helpers = require('./handlebars-helpers/helper');

app.use(session({
  secret: crypt.generateKeySync("hmac", { length: 32 }),
  cookie: {
    maxAge: 10800000
  },

}))

app.use((req, res, next) => {
  res.view = function(view, content){
    let values = {}

    if (Object.keys(req).includes("session") && Object.keys(req.session).includes("errors")) {
      values.errors = req.session.errors
      req.session.errors = null
    }

    if (Object.keys(req).includes("session") && Object.keys(req.session).includes("user")) {
      values.user = req.session.user
    }

    this.render(view, { ...content, ...values })

    
  }

  next()
})


// view engine setup
const hbs = create({
  helpers: helpers
})

app.set('views', path.join(__dirname, 'views'));
app.engine("handlebars", hbs.engine)
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/users/:idUser/servicos', servicosRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
