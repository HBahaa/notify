restDB = function(){
}

restDB['create_mongo_connection'] = function(mongoHost,MongoPort,Database) {
	var mongoose = require('mongoose');
	var mongoDB = 'mongodb://' + mongoHost + ':'+MongoPort +'/'+ Database;
	mongoose.connect(mongoDB);
}

restDB.insertNotification = function(topic,body, params, query, method, headers){
  notifications.collection.insert({
    'topic': topic,
    'ts': Math.floor(Date.now()),
    'notification': fn(body),
    "params": params,
    "query": query,
    "body": body,
    'method':method,
    'headers':headers
  })
}

restDB.getAll = function(topic){
  notifications.find({'topic': topic},(err,data) => {
    resp.send(data);
  })
}

restDB.getFrom = function(topic, from){
  notifications.find({'topic': topic,"ts": {$gte: req.params.from}}, (err, data)=>{
    resp.send(data);
  })
}

restDB.getForInterval = function(topic, from, to){
  notifications.find({'topic': topic, "ts": {$gte: req.params.from, $lte: req.params.to}}, (err, data)=>{
    resp.send(data);
  })
}

module.exports = restDB;
