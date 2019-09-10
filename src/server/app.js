'use strict';


const express = require('express');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');

var five = require("johnny-five");
var board = new five.Board();


const server = http.createServer(app);
	
var server_socket=server.listen(8000);
var io = require('socket.io').listen(server_socket);


board.on("ready", function() {
  var gps = new five.GPS({
    pins: {
      rx: 11,
      tx: 10,
    }
  });
  // If latitude, longitude change log it


  	  io.on('connection', function (socket) {
		console.log("socket connection");

		  gps.on("data", function() {
		  		var data ={
		  			longitude:this.longitude,
		  			latitude:this.latitude
		  		}

		  		setTimeout(function(){
		  			console.log('emitiendo');
					socket.emit('data', [data]);

		  		},3000);
		  			

  	  			

		  });
	  	
	  });
});





const  port = process.env.PORT || 8000;
var routes ;



app.use(bodyParser.urlencoded({extended:true}));//parse application/x-www-form-urlencoded
app.use(bodyParser.json({limit: '50mb'}));


//setea los archivos staticos
app.use('/', express.static('./src/client'));
app.use('/', express.static('./node_modules'));
app.use('/', express.static('./'));

app.get('*',function(req,res){
    res.sendfile('./src/client/index.html');
});

server.listen(port,function(){
    console.log('app listening on port ' + port);
});
