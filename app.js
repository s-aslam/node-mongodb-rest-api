const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const debug = require('debug')('server:server');
const cors = require('cors');
const pe = require('parse-error');
const path = require('path');
const routes = require('./routes');
const CONFIG = require('./config/config');  // Load the configuartion
const mongoose = require("mongoose");
const { ValidationError } = require('express-validation');


// DATABASE Connection

db_url = `${CONFIG.db_dialect}://${CONFIG.db_host}:${CONFIG.db_port}/${CONFIG.db_name}`,
mongoose.connect(db_url, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});


// Initiate the app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// CORS
app.use(cors());

// Load API routes
app.use('/api', routes);

app.use('/', function (req, res) {
  res.statusCode = 200;  // send the appropriate status code
  res.json({ message: "Welcome to Node JS Practical Test" })
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err)
  }
  console.log('JSON.stringify', JSON.stringify(err));
  return res.status(500).json(err);
});


// Normalize a port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// Get port from environment and store in Express.
const port = normalizePort(CONFIG.port || '3000');
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


// Event listener for HTTP server "error" event.

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Server listenning on port:', addr.port);
}
