const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const {es_bulk} = require("./es.js");
// Connection url
const url = 'mongodb://localhost:27017';

const POST_LIMIT=4194304/4;
// Database Name
const dbName = 'staking';
// Connect using MongoClient
var client = new MongoClient(url);
var db = null
var _bulk_string=''


function docToES(index_name){
	return function(doc){
		doc.ts = new Date();
		delete doc._id;
		let one_action = JSON.stringify({index:{_index:index_name}})+"\n"+JSON.stringify(doc)+"\n";
		if(_bulk_string.length + one_action.length > POST_LIMIT){
			let es_res = es_bulk(_bulk_string);
			console.log(JSON.stringify(es_res))
		}else{
			_bulk_string = _bulk_string+one_action;
		}
	}
		
}



async function main(){
	if(!client.isConnected())
		await client.connect();
	
	var collections = await client.db(dbName).collections();
	for(let i = 0;i < collections.length;i++){
		let collection = collections[i]
		console.log(collection.collectionName);
		//if(collection.collectionName =="stakes") continue;
		let index_name = "relay-history-"+collection.collectionName;
		await collection.find({}).forEach(docToES(index_name))
	}

	client.close();
	let es_res = es_bulk(_bulk_string);
	console.log(JSON.stringify(es_res))
	
	
}

main()