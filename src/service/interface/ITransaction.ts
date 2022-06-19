import { Transaction} from "../model/Transaction"

export interface ITransaction {
    
    api_key: string;
    signer_private_key: string;
    signer_account: string;
    

    send: (to: string, amount: string) => void;

    get: (hash: string) => Promise<Transaction>;
}