var express = require('express');
var cookieParser = require('cookie-parser');
var path = require('path');
var router = require('./app/routes');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var DB_URI = "mongodb://localhost:27017/ChatApp";
var app = express();
var mongo = require('mongodb');
var passport = require('passport');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var connect = require('connect');
var cors = require('cors');
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
const port = process.env.PORT || 8080 ;
server.listen(8180);
var connected = [];


// configure app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
/*
app.use('/api',router);
app.get('*',(req,res)=>{
  res.sendFile(__dirname + "/public/angular2");
});
*/
app.use(cookieParser());
app.use(morgan('dev'));
app.use(flash());
app.set('views', path.join(__dirname, 'views'));
app.use(cors());


app.use(passport.initialize());
app.use(passport.session());

/*
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.session = req.session;
  res.locals.user = req.user || null;
  next();
});
*/

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));


app.use(session({
  secret: 'This is a secret', resave: true,
  saveUninitialized: true,
  cookie: { expires: new Date(253402300000000) }
}));

app.use(function (req, res, next) {
  req.session.user = req.user || null;
  res.locals.user = req.user || null;
  //eq.session.businessOwner = req.businessOwner || null;

  next();
});

mongoose.Promise = global.Promise;
mongoose.connect(DB_URI);
var db = mongoose.connection;

db.on('error', function () { console.log("error") });
db.once('open', function () {
  // we're connected!
  console.log("we are connected");
});
require('./config/passport')(passport);
app.use('/', router);
app.listen(port, function () {
  console.log("server is listening on port" + port);
});

io.on('connection', (socket) => {
  console.log('user connected');
  connected.push(socket);

  socket.on('disconnect', function(){
    connected.splice(connected.indexOf(socket),1);
    console.log('user disconnected $s sockets connected', connected.length);
    socket.emit('logout')
  });

  socket.on('send-message', (sent) => {
    //io.socket.to(<socketid>).emit('hey', 'I just met you');
    io.sockets.emit('message', sent);
  });
  socket.on('login',(username) => {

  socket.emit('allusers',username);
});
socket.on('signup',(username) => {
  console.log('hena');
  socket.emit('sallusers');

});

});
