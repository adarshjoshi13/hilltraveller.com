var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const AddDestinationRouter = require('./routes/AddDestination')
const HomeBanner = require('./routes/HomeBanner')
const Hotels = require('./routes/Hotels')
const Testimonial = require('./routes/testimonial')
var cors = require('cors'); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Use cors middleware with specific options
// just a sample
app.use(cors({
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin',AddDestinationRouter)
app.use("/homebanner",HomeBanner)
app.use('/hotels',Hotels);
app.use('/testimonial',Testimonial)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
