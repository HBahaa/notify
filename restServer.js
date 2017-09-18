
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
		topics.findOne({'topic': topic}, (err, data)=>{
			if (!data) {
				topics.collection.insert({'topic': topic});
			}
		})
		notifications.collection.insert({
			'topic': topic,
			'ts': Math.floor(Date.now()),
			'notification': fn(req.body),
			"params": req.params,
			"query": req.query,
			"body": req.body,
			'method':req.method,
			'headers':req.headers
		})
		resp.status('200').send("success")
	})
}

restServer['addPChannel'] = function(topic){
	console.log("Publisher channel on rest created");

	restServer.post('/response/'+topic, function(req, resp){
		notifications.find({'topic': topic},(err,data) => {
	    resp.send(data);
	  })
	})

	restServer.post('/response/'+topic + "/:from", function(req, resp){
		notifications.find({'topic': topic,"ts": {$gte: req.params.from}}, (err, data)=>{
			resp.send(data);
		})
	})

	restServer.post('/response/'+topic + "/:from"+"/:to", function(req, resp){
		notifications.find({'topic': topic, "ts": {$gte: req.params.from, $lte: req.params.to}}, (err, data)=>{
			resp.send(data);
		})
	})
}

module.exports = restServer;
