"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rpc = require('json-rpc2');
require('dotenv').config();
//import { ITransaction } from "../model/ITransaction";
const EthTransaction_1 = require("../model/EthTransaction");
const server = rpc.Server.$create({
    'websocket': true,
    'headers': {
        'Access-Control-Allow-Origin': '*'
    }
});
server.on('error', function (err) {
    console.log(err);
});
function send(args, opt, callback) {
    const to = args[0];
    const amount = args[1];
    const txObj = new EthTransaction_1.EthTransaction();
    const promise = txObj.send(to, amount);
    promise.then((value) => {
        console.log("hash ---> ", value);
        callback(null, value);
    }).catch((err) => {
        callback("error ---> ", err);
        console.log(err);
    });
}
function get(args, opt, callback) {
    const txHash = args[0];
    const ethTx = new EthTransaction_1.EthTransaction();
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
//# sourceMappingURL=index.js.map