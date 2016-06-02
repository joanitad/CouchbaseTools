# CouchbaseTools

this is an inital tool for mass delete of couchbase documets filtered by customer_id

an optional dryrun argument can be passed on the command line

USAGE 

node mass-delete.js --conn="couchbase://127.0.0.1:8091&detailed_errcodes=1" --bucket="test" --pwd="test" --designdoc="dev_delete" --viewname="test_view" --cid=2 (deletes without a prompt)


node mass-delete.js --conn="couchbase://127.0.0.1:8091&detailed_errcodes=1" --bucket="test" --pwd="test" --designdoc="dev_delete" --viewname="test_view --cid=2 --dryrun

--help : provides a usage prompt 


if you want all the customer's to be deleted then don't add the customer_id entry in the YAML config file
