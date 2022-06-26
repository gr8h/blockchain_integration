require('dotenv').config();
const jayson = require('jayson/promise');


const port = process.env.PORT;
const client = jayson.Client.http({
    port: port
});

describe('Transaction test', () => {

    describe('Given the transaction exists', () => {

        const callbackMock = jest.fn(()=> true);

        describe('When using unsupported type', () => {

            it('Then "Unknown Blockchain type" error will occure',  async () => {

                let reqs = [
                    client.request('get_transaction', ["0x2baacbc52190c6b52381c663a695d4b1d6afba8ed398406755f6fbd9a49005bd", "Near"])
                ];
            
                const results = await Promise.all(reqs);
                const result = results[0].error;

                expect(result.code).toBe(400);
                expect(result.message).toBe('Unknown Blockchain type, please use Eth for Etherum or Sol for Solana');
            });

        });

        describe('When missing an argument', () => {

            it('Then "TransactionHash arguemnt is missing" error will occure',  async () => {

                let reqs = [
                    client.request('get_transaction', ["0x2baacbc52190c6b52381c663a695d4b1d6afba8ed398406755f6fbd9a49005bd"])
                ];
            
                const results = await Promise.all(reqs);
                const result = results[0].error;

                expect(result.code).toBe(400);
                expect(result.message).toBe('Please send the correct arguemnt. [TransactionHash, Blockchain(ETH, SOL)]');
            });

            it('Then "Blockchain arguemnt is missing" error will occure',  async () => {

                let reqs = [
                    client.request('get_transaction', ["Near"])
                ];
            
                const results = await Promise.all(reqs);
                const result = results[0].error;

                expect(result.code).toBe(400);
                expect(result.message).toBe('Please send the correct arguemnt. [TransactionHash, Blockchain(ETH, SOL)]');
            });

        });

        describe('When using supported type', () => {

            it('Then transaction object should return',  async () => {

                let reqs = [
                    client.request('get_transaction', ["0x2baacbc52190c6b52381c663a695d4b1d6afba8ed398406755f6fbd9a49005bd", "ETH"])
                ];
            
                const results = await Promise.all(reqs);
                const result = results[0].result;

                expect(result.amount).toBe('0.01');
                expect(result.from).toBe('0x50dbFC5D125dF1835BEe19eCEE63E46cdafD715d');
                expect(result.to).toBe('0x5A3Da324Bf0470d18C808fcC974a428558A41Ef0');
                expect(result.hash).toBe('0x2baacbc52190c6b52381c663a695d4b1d6afba8ed398406755f6fbd9a49005bd');
                expect(result.fee).toBe('0.000021000000147');
            });

        });

    });

    describe('Given there is enough balance', () => {

        describe('When using unsupported type to send a transaction', () => {

            it('Then "Unknown Blockchain type" error will occure',  async () => {

                let reqs = [
                    client.request('send_transaction', ["0x5A3Da324Bf0470d18C808fcC974a428558A41Ef0", "0.001" ,"XRP"])
                ];
            
                const results = await Promise.all(reqs);
                const result = results[0].error;

                expect(result.code).toBe(400);
                expect(result.message).toBe('Unknown Blockchain type, please use Eth for Etherum or Sol for Solana');
            });

        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});