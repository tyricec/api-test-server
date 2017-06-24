var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing configuration into DynamoDB. Please wait.");

var apiConfig = JSON.parse(fs.readFileSync('api.json', 'utf8'));
apiConfig.forEach(function(api) {
    var params = {
        TableName: "Config",
        Item: {
            "name":  api.name,
            "endpoint": api.endpoint,
            "responses":  api.responses,
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add movie", api.name, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", api.name);
       }
    });
});
