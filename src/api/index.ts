var rpc = require('json-rpc2');
require('dotenv').config();

//import { ITransaction } from "../model/ITransaction";
import { EthTransaction } from "../model/EthTransaction";

var server = rpc.Server.$create({
    'websocket': true, // is true by default
    'headers': { // allow custom headers is empty by default
        'Access-Control-Allow-Origin': '*'
    }
});

server.on('error', function (err){
  console.log(err);
});

function send(args, opt, callback) {

  const to = args[0]
  const amount = args[1]

  const txObj = new EthTransaction();
  const promise = txObj.send(to, amount);

  promise.then((value) => {
    console.log("hash ---> ",value);
    callback(null, value);
  }).catch((err) => {
    callback("error ---> ", err);
    console.log(err);
  });
}

function get(args, opt, callback) {

  const txHash = args[0]

  const ethTx = new EthTransaction();
  const promise = ethTx.get(txHash);

  promise.then((value) => {
    console.log(value);
    callback(null, value);
  }).catch((err) => {
    callback(err);
    console.log(err);
  });
}

server.expose('send', send);
server.expose('get', get);

// listen creates an HTTP server on localhost only
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});