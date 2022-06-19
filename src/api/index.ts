const rpc = require('json-rpc2');
require('dotenv').config();

import { TransactionFactory } from "../service/TransactionFactory"; 
import { CustomException } from "../exceptions/CustomException";

const server = rpc.Server.$create({
    'websocket': true, // is true by default
    'headers': { // allow custom headers is empty by default
        'Access-Control-Allow-Origin': '*'
    }
});

server.on('error', function (err){
  console.log(err);
});

async function send(args, opt, callback) {

  const to = args[0]
  const amount = args[1]
  const blockchain = args[2]

  try {

    const txObj = TransactionFactory.create(blockchain);
    await txObj.send(to, amount);
  
    callback(null, "🎉 Transaction sent");

  } catch (err) {
    callback(err);
  }
}

function get(args, opt, callback) {

  const txHash = args[0]
  const blockchain = args[1]

  if (!txHash) {
    const ex = new CustomException(400,'TransactionHash arguemnt is missing. [TransactionHash, Blockchain]');
    callback(ex);
  }

  if (!blockchain) {
    const ex = new CustomException(400,'Blockchain arguemnt is missing. [TransactionHash, Blockchain]');
    callback(ex);
  }

  try {

    const ethTx = TransactionFactory.create(blockchain);
    const promise = ethTx.get(txHash);
  
    promise.then((value) => {
      console.log(value);
      callback(null, value);
    }).catch((err) => {
      callback(err);
      console.log(err);
    });

  } catch (err){
    callback(err);
  }
}

server.expose('send', send);
server.expose('get', get);

// listen creates an HTTP server on localhost only
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`🎉 Listening: http://localhost:${port}`);
});