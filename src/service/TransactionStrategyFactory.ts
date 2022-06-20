import { EthTransaction } from "./EthTransaction";
import { SolTransaction } from "./SolTransaction";
import { CustomException } from "../exceptions/CustomException";
import { ITransaction, BlockchainTypes } from "./interface/ITransaction";

export class TransactionStrategyFactory {

	private static strategies = [
		new EthTransaction(),
		new SolTransaction()
	]

	static getTransactiontrategy(type: BlockchainTypes): ITransaction {
		const strategy =  this.strategies.find(strategy => strategy.checkType(type));

		if (strategy == null) {
			const msg = "Unknown Blockchain type, please use Eth for Etherum or Sol for Solana";
            console.log(msg);
            throw new CustomException(400, msg);
		}

		return strategy;
	}
}