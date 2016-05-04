# CouchbaseTools

this is an inital tool for mass delete of couchbase documets filtered by customer_id

Please look at config.sample.yml and make a copy and name it config.yml and change the values as needed.

an optional dryrun argument can be passed on the command line

USAGE 

node mass-delete --dryrun


if you want all the customer's to be deleted then don't add the customer_id entry in the YAML config file
