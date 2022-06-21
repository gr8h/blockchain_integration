import { BlockchainTypes, ITransaction } from "./interface/ITransaction";
import { CustomException } from "../exceptions/CustomException";

export class SolTransaction implements ITransaction {
   
    api_key: string;
    signer_private_key: string;
    signer_account: string;
    
    checkType (type: BlockchainTypes) {
        return type == BlockchainTypes.SOL;
    }

    async send(to: string, amount: string) {
        throw new CustomException(501,'Not implemented.');
    }

    async get(hash: string) {
        throw new CustomException(501,'Not implemented.');
        return null;
    }
}