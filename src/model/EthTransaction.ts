import { ITransaction, Transaction } from "../model/ITransaction";

export class EthTransaction implements ITransaction {
    
    api_key: string;
    signer_private_key: string;
    signer_account: string;

    constructor() {
        this.api_key = process.env.ETH_API_URL;
        this.signer_private_key = process.env.ETH_PRIVATE_KEY;
        this.signer_account = process.env.ETH_ACCOUNT;
    }

    async send(to: string, amount: string) {
        const Web3 = require('web3')
        const web3 = new Web3(this.api_key)

        const balance = await web3.eth.getBalance(this.signer_account);
        if(balance < amount) {
            console.log("❗Not enough balance.")
        }

        const nonce = await web3.eth.getTransactionCount(this.signer_account, 'latest');
        const transaction = {
            from: this.signer_account,
            to: to,
            value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
            gas: 300000,
            nonce: nonce
        };

        const signedTx = await web3.eth.accounts.signTransaction(transaction, this.signer_private_key)

        const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        
        /*web3.eth.sendSignedTransaction(signedTx.rawTransaction).then((value) => {
            console.log(`🎉 Check transaction! https://ropsten.etherscan.io/tx/${value.transactionHash}`);
            return value.transactionHash;
          }).catch((err) => {
            console.log("❗Something went wrong while submitting your transaction:", err)
          });*/

        console.log(`🎉 Check transaction! https://ropsten.etherscan.io/tx/${tx.transactionHash}`);
        return tx.transactionHash;;
    }

    async get(hash: string) {
        const Web3 = require('web3')
        const web3 = new Web3(this.api_key)
        const txReceipt = await web3.eth.getTransactionReceipt(hash);

        let txObj = new Transaction();

        if(txReceipt == null){
            console.log("❗Transaction is pending...")
            return txObj;
        }

        if(!txReceipt.status) {
            console.log("❗Transaction is reverted...")
            return txObj;
        }
        const tx = await web3.eth.getTransaction(hash);

        const fee = txReceipt.gasUsed * txReceipt.effectiveGasPrice;

        txObj.amount = web3.utils.fromWei(tx.value.toString(), 'ether');
        txObj.from = tx.from;
        txObj.hash = tx.hash;
        txObj.to = tx.to;
        txObj.fee = web3.utils.fromWei(fee.toString(), 'ether');

        return txObj;
    }
}