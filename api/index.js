var rpc = require('json-rpc2');

var server = rpc.Server.$create({
    'websocket': true, // is true by default
    'headers': { // allow custom headers is empty by default
        'Access-Control-Allow-Origin': '*'
    }
});

server.on('error', function (err){
  console.log(err);
});

function add(args, opt, callback) {
  callback(null, args[0] + args[1]);
}

server.expose('add', add);

// listen creates an HTTP server on localhost only
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});