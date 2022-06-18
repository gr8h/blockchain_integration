"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthTransaction = void 0;
const ITransaction_1 = require("../model/ITransaction");
class EthTransaction {
    constructor() {
        this.api_key = process.env.ETH_API_URL;
        this.signer_private_key = process.env.ETH_PRIVATE_KEY;
        this.signer_account = process.env.ETH_ACCOUNT;
    }
    send(to, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const Web3 = require('web3');
            const web3 = new Web3(this.api_key);
            const balance = yield web3.eth.getBalance(this.signer_account);
            if (balance < amount) {
                console.log("❗Not enough balance.");
            }
            const nonce = yield web3.eth.getTransactionCount(this.signer_account, 'latest');
            const transaction = {
                from: this.signer_account,
                to: to,
                value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
                gas: 300000,
                nonce: nonce
            };
            const signedTx = yield web3.eth.accounts.signTransaction(transaction, this.signer_private_key);
            const tx = yield web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            /*web3.eth.sendSignedTransaction(signedTx.rawTransaction).then((value) => {
                console.log(`🎉 Check transaction! https://ropsten.etherscan.io/tx/${value.transactionHash}`);
                return value.transactionHash;
              }).catch((err) => {
                console.log("❗Something went wrong while submitting your transaction:", err)
              });*/
            console.log(`🎉 Check transaction! https://ropsten.etherscan.io/tx/${tx.transactionHash}`);
            return tx.transactionHash;
            ;
        });
    }
    get(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            const Web3 = require('web3');
            const web3 = new Web3(this.api_key);
            const txReceipt = yield web3.eth.getTransactionReceipt(hash);
            let txObj = new ITransaction_1.Transaction();
            if (txReceipt == null) {
                console.log("❗Transaction is pending...");
                return txObj;
            }
            if (!txReceipt.status) {
                console.log("❗Transaction is reverted...");
                return txObj;
            }
            const tx = yield web3.eth.getTransaction(hash);
            const fee = txReceipt.gasUsed * txReceipt.effectiveGasPrice;
            txObj.amount = web3.utils.fromWei(tx.value.toString(), 'ether');
            txObj.from = tx.from;
            txObj.hash = tx.hash;
            txObj.to = tx.to;
            txObj.fee = web3.utils.fromWei(fee.toString(), 'ether');
            return txObj;
        });
    }
}
exports.EthTransaction = EthTransaction;
//# sourceMappingURL=EthTransaction.js.map