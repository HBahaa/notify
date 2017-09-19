var mongoDB = require("./mongoDB");
var wsServer = require("./wsServer");

rest = function(){
	var express = require("express");
	var app = express();
	var bodyParser = require('body-parser');
	//support parsing of application/json type post data
	app.use(bodyParser.json());
	//support parsing of application/x-www-form-urlencoded post data
	app.use(bodyParser.urlencoded({ extended: true }));
	app.listen(7000);
	console.log("rest server started");
	return app;
}

restServer = rest();

restServer['addLChannel'] = function(topic, fn){
	console.log("listener channel on rest created");
	restServer.post('/'+topic, function(req, resp){
		mongoDB.getTopic(topic, function(err, result) {
			if (err) {
				console.log(err);
			}
			if (!result) {
				mongoDB.insertTopic(topic)
			}
		})
		mongoDB.insertNotification(topic,fn(req.body), req.params, req.query,req.body, req.method, req.headers)
		wsServer.to(topic).emit('serverpublisher', fn(req.body))
		resp.status('200').send("success")
	})
}

restServer['addPChannel'] = function(topic){
	console.log("Publisher channel on rest created");

	restServer.post('/response/'+topic, function(req, resp){
		mongoDB.getAll(topic, function(err, result) {
			if (err) {
				console.log(err);
			}
			resp.send(result);
		})
	})

	restServer.post('/response/'+topic + "/:from", function(req, resp){
		mongoDB.getFrom('javascript', req.params.from, function(err, result) {
			if (err) {
				console.log(err);
			}
			resp.send(result);
		});
	})

	restServer.post('/response/'+topic + "/:from"+"/:to", function(req, resp){
		mongoDB.getForInterval('javascript', req.params.from, req.params.to, function(err, result) {
			if (err) {
				console.log(err);
			}
			resp.send(result);
		});
	})
}

module.exports = restServer;
