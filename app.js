//http://blog.couchbase.com/mass-deleting-documents-by-compound-key-prefix-using-node-js
var express = require("express");
var couchbase = require("couchbase");
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
query.range(customer_id, customer_id + 1 ,false);

bucket.query(query, function(error, results) {
    if(error) {
        return console.log(error);
    }
    console.log("Found " + results.length + " documents to delete");
    for(i in results) {
        bucket.remove(results[i].id, function(error, result) {
            console.log("Deleting " + results[i].key);
        });
    }
    console.log("Mass Delete complete");
});

var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});
