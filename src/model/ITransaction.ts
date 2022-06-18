export interface ITransaction {
    
    api_key: string;
    signer_private_key: string;
    signer_account: string;
    

    send: (to: string, amount: string) => Promise<string>;

    get: (hash: string) => Promise<Transaction>;
}

export class Transaction {

    from: string;
    to: string;
    amount: string;
    fee: number;
    hash: string;
}