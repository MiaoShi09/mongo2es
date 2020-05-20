const MongoClient = require('mongodb').MongoClient;
// Connection url
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'staking';
// Connect using MongoClient
MongoClient.connect(url, function(err, client) {
// Create a collection we want to drop later
	console.log("xxxxx");
	client.db(dbName).listCollections({},function(err,res){
		console.log("sxxxx");
		console.log(res);
		client.close()
	})
	
});