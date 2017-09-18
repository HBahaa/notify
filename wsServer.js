var notifications = require("./notification");
var topics = require("./topics");
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
	// ws.applyOnTopic[topic] = fn
	console.log("listener channel on ws created");
	var socket = wsServer;

	socket.on('connection', function(socket){
		socket.on("listner",function(data){
			notifications.collection.insert({
				'topic': data.topic,
				'ts': Math.floor(Date.now()),
				'notification': fn(data.notification)
			})
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
				notifications.find({'topic': data.topic},(err,data2) => {
					console.log("client publisher");
					socket.emit('response', data2);
			  })
			}
			else if (data.topic && data.from != undefined && data.to == undefined) {
				notifications.find({'topic': data.topic, "ts": {$gte: data.from}}, (err, data)=>{
					socket.emit("response", data);
				})
			}
			else if (data.topic && data.from != undefined && data.to != undefined) {
				notifications.find({'topic': data.topic,"ts": {$gte: data.from, $lte: data.to}}, (err, data)=>{
					socket.emit("response", data);
				})
			}
	  })
	})
}

module.exports = wsServer;
