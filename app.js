var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
var logger = require('morgan');
let mongoose = require("mongoose");
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
mongoose.set('runValidators', true);
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.once('open', () => {
  console.log("Well done! , connected with mongoDB database");
}).on('error', error => {
  console.log("Oops! database connection error:" + error);
}); 

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const apispaths = [
  { pathUrl: '/auth', routeFile: 'login' },
  { pathUrl: '/recipe', routeFile: 'recipes' },
];
apispaths.forEach((path) => {
	app.use('/apis/v1' + path.pathUrl, require('./routes/apis/v1/' + path.routeFile));
});

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
