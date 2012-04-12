var server,
    ip   = process.argv[2] || "127.0.0.1",
    port = process.argv[3] || 1337,
    http = require('http'),
    qs = require('querystring'),
    url = require('url'),
	fs = require('fs'),
	requests = [],
	data;

server = http.createServer(function (req, res) {
  	var path = url.parse(req.url),
    parameter = qs.parse(path.query);

  	console.dir(parameter);
	
	switch (path.pathname) {
		case "/sync":
		  requests.push({
			res: res, 
			timestamp: new Date().getTime()
		  });
	      break;
		case "/update":
		  data = {};
		  data.code = parameter.code;
		  data.state = true;
	      break;
  		default:
		  fs.readFile('sender.html', 'utf-8',function (error, data) {
		         if (error) throw error;
		         res.writeHead(200, {"Content-Type": "text/html"});
		         res.end(data);
		  });
		  break;
	}
});

server.listen(port, ip);
console.log("Server running at http://" + ip + ":" + port);

setInterval( function() {
	// close out requests older than 30 seconds
	var expiration = new Date().getTime() - 30000;
	var res,
		temp = [];
	for (var i = requests.length-1; i>=0;i--) {
		req = requests[i];
		if( data ){
			req.res.writeHead(200, {'Content-Type': 'text/plain'});
			req.res.end(JSON.stringify(data));
		}else if (req.timestamp < expiration) {
			req.res.writeHead(200, { "Content-Type": "text/plain" });
			req.res.end('{"state" : false}');
		}else{
			temp.push( req );
		}
	}
	data = null;
	requests = temp;
}, 1000);
