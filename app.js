var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config/conf');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Importing swagger file
const swaggerDocument = YAML.load('./swagger.yaml');

var attendanceRouter = require('./routes/attendances');
var app = express();

// view engine setup
app.set('port', config.SERVER.PORT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/attendance', attendanceRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// serve swagger
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(app.get('port'), function (req, res) {
  console.log('Express server listening on port ' + app.get('port'));
});

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
