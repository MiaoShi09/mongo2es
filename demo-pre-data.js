const MongoClient = require('mongodb').MongoClient;
// Connection url
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'staking';
// Connect using MongoClient
var client = new MongoClient(url);
var db = null

client.connect(function(err){
	if(err){
		console.log(err);
	}else{
		db = client.db(dbName);
		createCollection("test1",()=>{
			insertData('test1',[{test:1},{test:2}], ()=>{
				createCollection("test2", ()=>{
					insertData("test2",[{name:1},{name:2}],()=>{
						client.close()
					})
				})})})
	}
})


function createCollection(collection_name, callback){
	db.createCollection(collection_name,function(err,results){
			if(err){
				console.log('collection creation error', err);
			}else{
				console.log('collection creation success');
				console.log(results)
				callback(err,results);
			}
		})
}
function insertData(collection_name,data,callback){
	db.collection(collection_name,{},function(err,collection){
		collection.insertMany(data,{},function(err,result){
			if(err) console.log(err)
			else console.log(result)

			callback(err,result);
		})
	})
}