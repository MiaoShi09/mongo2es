const MongoClient = require('mongodb').MongoClient;
const {es_put} = require("./es.js");
// Connection url
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'staking';
// Connect using MongoClient
var client = new MongoClient(url);
var db = null

var _bulk_string = "";

function docToES(index_name){
	return function(doc){
		doc.ts = new Date();
		let one_action = JSON.stringify({index:{_index:index_name}})+"\n"+JSON.stringify(doc)+"\n";
		_bulk_string = _bulk_string+one_action;
	}
}



async function main(){
	await client.connect();
	
	var collections = await client.db(dbName).collections();
	for(let i = 0;i < collections.length;i++){
		let collection = collections[i];
		console.log(collection.collectionName);
		let index_name = "relay-history-"+collection.collectionName;
		await collection.find({}).forEach(docToES(index_name))
	}
	console.log(_bulk_string);




	client.close();
}

main()