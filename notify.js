var notifications = require("./notification");
var topics = require("./topics");
var restServer = require("./restServer");
var wsServer = require("./wsServer");
var mongoDB = require("./mongoDB");

//requrie modules here
function notify(){

}


notify.init = function(mongoHost,MongoPort,Database){
		notify.ws = wsServer;
		notify.rest = restServer;
		notify.mongo = mongoDB.create_mongo_connection(mongoHost,MongoPort,Database)

};
module.exports = notify;
