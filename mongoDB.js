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

mongoose.insertNotification = function(topic, fn, body, params, query, method, headers){
  notifications.collection.insert({
    'topic': topic,
    'ts': Math.floor(Date.now()),
    'notification': fn,
    "params": params,
    "query": query,
    "body": body,
    'method':method,
    'headers':headers
  })
}

mongoose['getAll'] = function(topic, callback){
  var data = notifications.find({'topic': topic}, (err, data)=>{
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}

mongoose.getFrom = function(topic, from, callback){
  notifications.find({'topic': topic,"ts": {$gte: from}}, (err, data)=>{
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  })
}

mongoose.getForInterval = function(topic, from, to, callback){
  notifications.find({'topic': topic, "ts": {$gte: from, $lte: to}}, (err, data)=>{
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  })
}

mongoose.getTopic = function(topic, callback){
 topics.findOne({'topic': topic}, (err, data)=>{
   if (err) {
     callback(err, null);
   } else {
     callback(null, data);
   }
 })
}

mongoose.insertTopic = function(topic){
 topics.collection.insert({'topic': topic});
}

module.exports = mongoose;
