import { EthTransaction } from "./EthTransaction";
import { SolTransaction } from "./SolTransaction";
import { CustomException } from "../exceptions/CustomException";

export class TransactionFactory {

    static create(type: string) {
      switch (type) {
        case 'Eth':
          return new EthTransaction();
        case 'Sol':
          return new SolTransaction();
        default:
          {
            const msg = "Unknown Blockchain type, please use Eth for Etherum or Sol for Solana";
            console.log(msg);
            throw new CustomException(400, msg);
          }
      }
    }
}