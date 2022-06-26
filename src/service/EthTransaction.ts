import { ITransaction, BlockchainTypes } from "./interface/ITransaction";
import { ReturnedTransaction } from "./model/ReturnedTransaction"
import { CustomException } from "../exception/CustomException";

export class EthTransaction implements ITransaction {
    
    api_key: string;
    signer_private_key: string;
    signer_account: string;

    constructor() {
        this.api_key = process.env.ETH_API_URL;
        this.signer_private_key = process.env.ETH_PRIVATE_KEY;
        this.signer_account = process.env.ETH_ACCOUNT;
    }
    checkType (type: BlockchainTypes) {
        return type == BlockchainTypes.ETH;
    }

    async send(to: string, amount: string) {
        const Web3 = require('web3')
        const web3 = new Web3(this.api_key)

        const balanceWei = await web3.eth.getBalance(this.signer_account);
        const balance = web3.utils.fromWei(balanceWei.toString(), 'ether');
        if(balance < amount) {
            console.log('❗Not enough balance.');
            throw new CustomException(402,'Not enough balance.');
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

        web3.eth.sendSignedTransaction(signedTx.rawTransaction).then((value) => {
            console.log(`🎉Check transaction! https://ropsten.etherscan.io/tx/${value.transactionHash}`);
          }).catch((err) => {
            console.log("❗Something went wrong while submitting your transaction:", err)
            throw err;
          });
    }

    async get(hash: string) {
        const Web3 = require('web3')
        const web3 = new Web3(this.api_key)
        const txReceipt = await web3.eth.getTransactionReceipt(hash);

        const txObj = new ReturnedTransaction();

        if(txReceipt == null) {
            console.log("❗Transaction is pending...")
            throw new CustomException(404,'Transaction is pending...');
        }

        if(!txReceipt.status) {
            console.log("❗Transaction is reverted...")
            throw new CustomException(404,'Transaction is reverted.');
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