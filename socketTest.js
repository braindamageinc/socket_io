var http  = require('http');

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
var clients = new Array();

function onEventFromClient(data)
{
    console.log(data);
    
    console.log(data.my);
}

function onSocketConnected(socket)
{
  socket.emit('news', { hello: 'hello world' });
  
  socket.on('my other event', onEventFromClient); 
  
  clients[mIdx] = socket.id;
  mIdx++;
  
  var refresh = setInterval( function() {
                for (var i=0; i < mIdx; i++)
                {
                    var msg = "<br>clients: " +  clients[i];
                    socket.emit('news', {hello: msg});
                }
             }, 2000 );

    socket.on('disconnect', function() {
        clearInterval(refresh);
    });
    
    //getGoogle();
    
}
    

io.sockets.on('connection', onSocketConnected);

function getGoogle() {
    var google = http.createClient(80, 'www.google.com');
    var request = google.request('GET', '/',
      {'host': 'www.google.com'});
    request.end();
    request.on('response', function (response) {
      console.log('STATUS: ' + response.statusCode);
      console.log('HEADERS: ' + JSON.stringify(response.headers));
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
      });
    });
}