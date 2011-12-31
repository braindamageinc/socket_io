var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(process.env.C9_PORT);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var mIdx = 0;

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  }); 
  
  var refresh = setInterval( function() {
                var msg = "sugi " + mIdx + socket.id;
                socket.emit('news', {hello: msg});
                mIdx++;
             }, 2000 );

    socket.on('disconnect', function() {
        clearInterval(refresh);
    });
    
});

