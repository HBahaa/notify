var mongoose = require('mongoose');
var notifications = require("./notification");
var topics = require("./topics");

var notificationsSchema = new mongoose.Schema({
  _id:String,
  'topic': String,
  'ts': Number,
  'notification':String,
  'HttpVersion': String,
  "params": {},
  "query": {},
  "body": {},
  'method': String,
  'headers':{}
});

// mongoose.model('notifications', notificationsSchema);

mongoose['create_mongo_connection'] = function(mongoHost,MongoPort,Database) {
	var mongoDB = 'mongodb://' + mongoHost + ':'+MongoPort +'/'+ Database;
	mongoose.connect(mongoDB);
}

mongoose.insertNotification = function(topic,body, params, query, method, headers){
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

mongoose['getAll'] = function(topic){
  notifications.find({'topic': topic},(err,data) => {
    return data;
  })
}

mongoose.getFrom = function(topic, from){
  notifications.find({'topic': topic,"ts": {$gte: req.params.from}}, (err, data)=>{
    return data;
  })
}

mongoose.getForInterval = function(topic, from, to){
  notifications.find({'topic': topic, "ts": {$gte: req.params.from, $lte: req.params.to}}, (err, data)=>{
    return data;
  })
}

module.exports = mongoose;
