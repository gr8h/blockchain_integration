require('dotenv').config();
const jayson = require('jayson/promise');

import { TransactionStrategyFactory } from "../service/interface/TransactionStrategyFactory"; 
import { CustomException } from "../exception/CustomException";
import { BlockchainTypes } from "../service/interface/ITransaction";

const server = new jayson.Server({

	send_transaction: async function(args) {
		
		const to = args[0]
		const amount = args[1]
		const blockchain = args[2]

		const typedBlockchainString: keyof typeof BlockchainTypes = blockchain.toUpperCase();

		try {

			const txObj = TransactionStrategyFactory.getTransactiontrategy(BlockchainTypes[typedBlockchainString]);
			await txObj.send(to, amount);
	
			return "Transaction sent."
	
		} catch (ex) {
			throw server.error(ex.status, ex.message);
		}
	},

	get_transaction: async function(args) {
		
		const txHash = args[0]
		const blockchain = args[1]

		if (!txHash || !blockchain) {
			const ex = new CustomException(400,'Please send the correct arguemnt. [TransactionHash, Blockchain(ETH, SOL)]');
			throw server.error(ex.status, ex.message);
		}
	
		try {
			const typedBlockchainString: keyof typeof BlockchainTypes = blockchain.toUpperCase();
	
			const ethTx = TransactionStrategyFactory.getTransactiontrategy(BlockchainTypes[typedBlockchainString]);
			const promise = await ethTx.get(txHash);
	
			return promise;
	
		} catch (ex){
			throw server.error(ex.status, ex.message);
		}
	}

});

const port = process.env.PORT;
server.http().listen(port, () => {
	console.log(`🎉 Listening: http://localhost:${port}`);
});