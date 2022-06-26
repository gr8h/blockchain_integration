import { ReturnedTransaction} from "../model/ReturnedTransaction"

export enum BlockchainTypes {ETH, SOL}

export interface ITransaction {
    
    api_key: string;
    signer_private_key: string;
    signer_account: string;
    
    checkType: (type: BlockchainTypes) => boolean;

    send: (to: string, amount: string) => void;

    get: (hash: string) => Promise<ReturnedTransaction>;
}