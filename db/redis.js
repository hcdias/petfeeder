var redis = require('redis');
var client = redis.createClient();

function redisObject(){
	this.redis = redis;
	this.client = client;
}

redisObject.prototype.saveData = function(objectData){
	client.hmset()
}

module.exports = new redisObject();