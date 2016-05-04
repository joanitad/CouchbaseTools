//http://blog.couchbase.com/mass-deleting-documents-by-compound-key-prefix-using-node-js
var express = require("express");
var couchbase = require("couchbase");
var argv = require('yargs').argv;
var yesno = require('yesno');
var yaml = require("js-yaml");
var fs = require("fs");
var config = yaml.load(fs.readFileSync("config.yml"));
var app = express();

var conn = config.couchbase_connection;
var bucket_name = config.couchbase_bucket;
var bucket_pwd = config.couchbase_bucket_password;
var bucket = (new couchbase.Cluster(conn)).openBucket(bucket_name,bucket_pwd);

var ViewQuery = couchbase.ViewQuery;
var design_doc = config.couchbase_design_doc;
var view_name = config.view_name;
var query = ViewQuery.from(design_doc, view_name);

var customer_id = config.customer_id;
if(customer_id){
	query.range(customer_id, customer_id + 1 ,false);
}else{
	console.log('Attempting mass delete for all customers');
}

function massDelete(results){
  for(i in results) {
        console.log("Deleting "+results[i].id+" for customer_id " + results[i].key);
        bucket.remove(results[i].id,function(error, result) {
            if(error){
                console.log("There was an error removing the doc ",error);
            }
        });
    }
  console.log("Mass Delete complete");
}
bucket.query(query, function(error, results) {
    if(error) {
        return console.log(error);
    }
    console.log("Found " + results.length + " documents to delete");
    if(results.length>0){
        if(argv.dryrun){
           console.log("Dry run: Preparing to delete the following");
           for(i in results) {
        	console.log(results[i].id+" for customer_id " + results[i].key);
           }
           yesno.ask('Does this look like what you wanted ?(Y/N) : ', true , function (ok) {
        	if(ok) {
        		console.log("Proceeding to delete...");
                        massDelete(results);
   		} else {
        		console.log("Aborting...");
                        process.exit(1);
    		}
	   });
  
         }else{
		massDelete(results);
         }
    }else{
         console.log("No Documents to delete ...");
    }
});
var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});
