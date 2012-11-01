
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

var server=http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
})


var mongoose = require('mongoose');
mongoose.connect('mongodb://guest:guest@alex.mongohq.com:10090/testDB');
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var ChatMsg = new Schema({
    name     : String
  , msg  : String
  , time  : Date
});

var ChatMsg = mongoose.model('ChatMsg', ChatMsg);


app.get('/ChatMsg/listAll', function(req, res) {
  console.log("in /ChatMsg/listAll");
  ChatMsg.find({}, function (err, docs) {
    res.send(docs);
  });
});



var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  socket.on('addme',function(username) {
    socket.username = username;
    socket.emit('chat', 'SERVER', 'You have connected'); 
    socket.broadcast.emit('chat', 'SERVER', username + ' is on deck');
  });


  socket.on('sendchat', function(data) { 

    var chatMsg1 = new ChatMsg();

    chatMsg1.name = socket.username;
    chatMsg1.msg = data;
    chatMsg1.time = new Date();

    chatMsg1.save(function(err) {
      //do something
      io.sockets.emit('chat', socket.username, data);
    });
  });  

  socket.on('getAllChat', function(data) { 

    ChatMsg.find({},function(err, msgList){
      for (var i in msgList) {
          socket.emit('chat', "socket-"+msgList[i].name, msgList[i].msg);
      }
    })
  });   





  socket.on('disconnect', function() {
    io.sockets.emit('chat', 'SERVER', socket.username + ' has left the building');
  });
});







