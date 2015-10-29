/*Headers*/
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept,",
  "access-control-max-age": 10 // Seconds.
};

/*Important modules*/
var fs = require('fs');

/*Dummy Data*/
var data = {results: [{username: 'Hercules',text: 'Server is connecting to client successfully'}]};

/*Helper Functions*/
var collectData = function(request, callback){
  request.on('data', function(chunk){
    data.results.push(chunk);
  })
  request.on('end', function(){
    JSON.stringify(data);
  })
};

/*Request Specific Actions */
var actions = {
  GET : function(request, response){
    var statusCode = 200;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = "text/plain";
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));
  },
  POST: function(request, response){
    var statusCode = 201;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = "text/plain";
    //response.writeHead(statusCode, headers);
    //response.end(JSON.stringify(data));
    collectData(request);
  }
};

/*Request Handler Function*/
var requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  var method = request.method;
  if (actions[method]) 
    actions[method](request, response);
};



//OPTIONS FOR EXPORTING REQUEST-HANDLER FUNCTION
//exports.requestHandler = requestHandler;
module.exports = requestHandler;


