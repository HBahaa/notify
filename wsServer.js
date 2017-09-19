var mongoDB = require("./mongoDB");

ws = function(){
	var app = require('express')();
	var http = require('http').Server(app);

	var socket = require('socket.io')(http);
	socket.on('connection', function(socket){
		socket.on("set",function(data){
			socket.join(data.topic,function(){
				console.log("socket joined a room "+data.topic)
			})
			socket.to(data.topic).emit('join',"user joined "+data.topic)
		})
	});

	http.listen(9000, function(){
  		console.log('ws server started listening on :9000');
	});

	return socket;
}

wsServer = ws();

wsServer['addLChannel'] = function(topic, fn){
	console.log("listener channel on ws created");
	var socket = wsServer;

	socket.on('connection', function(socket){
		socket.on("listner",function(data){
			mongoDB.getTopic(data.topic, function(err, result) {
				if (err) {
					console.log(err);
				}
				if (!result) {
					mongoDB.insertTopic(data.topic)
				}
			})
			mongoDB.insertNotification(data.topic, fn(data.notification));
			socket.to(data.topic).emit('serverpublisher', fn(data.notification))
		})
	});
}

wsServer['addPChannel'] = function(topic){
	console.log("Publisher channel on ws created");
	var socket = wsServer;
	socket.on('connection', function(socket){
		socket.on('clientpublisher', function(data){
			if (data.topic && data.from == undefined && data.to == undefined) {
				mongoDB.getAll(data.topic, function(err, result) {
				  if (err) {
				    console.log(err);
				  }
					socket.emit("response", result);
				})
			}
			else if (data.topic && data.from != undefined && data.to == undefined) {
				mongoDB.getFrom('javascript', data.from, function(err, result) {
				  if (err) {
				    console.log(err);
				  }
					socket.emit("response", result);
				});
			}
			else if (data.topic && data.from != undefined && data.to != undefined) {
				mongoDB.getForInterval('javascript', data.from, data.to, function(err, result) {
				  if (err) {
				    console.log(err);
				  }
					socket.emit("response", result);
				});
			}
	  })
	})
}

module.exports = wsServer;
