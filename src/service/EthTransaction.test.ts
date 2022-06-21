var rpc = require('json-rpc2');
require('dotenv').config();

var client = rpc.Client.$create(process.env.PORT, 'localhost');


it('Test Get transaction Sucessful', async done => {

    const res = client.call('get', ["0x2baacbc52190c6b52381c663a695d4b1d6afba8ed398406755f6fbd9a49005bd", "Eth"]);
    expect(res.httpCode).toBe(200);
    var decoded = JSON.parse(res.httpBody);
    expect(decoded.id).toBe(1);
    expect(decoded.error).toBe(undefined);
    
    expect(decoded.result).toBe({
        "amount": "0.01",
        "from": "0x50dbFC5D125dF1835BEe19eCEE63E46cdafD715d",
        "hash": "0x2baacbc52190c6b52381c663a695d4b1d6afba8ed398406755f6fbd9a49005bd",
        "to": "0x5A3Da324Bf0470d18C808fcC974a428558A41Ef0",
        "fee": "0.000021000000147"
    });

    done();
});

it('Test Get transaction Error', async done => {

    const res = client.call('get', ["0x2baacbc52190c6b52381c663a695d4b1d6afba8ed398406755f6fbd9a49005bd", "XRP"]);

    var decoded = JSON.parse(res.httpBody);
    expect(decoded.id).toBe(1);
    expect(decoded.error.message).toBe('Error: Unknown Blockchain type, please use Eth for Etherum or Sol for Solana');
    expect(decoded.error.code).toBe(-32603);

    done();
});

it('Test Post transaction Wrong Type', async done => {

    const res = await client.call('send', ["0x5A3Da324Bf0470d18C808fcC974a428558A41Ef0", "0.001", "XRP"]);
    
    var decoded = JSON.parse(res.httpBody);
    expect(decoded.id).toBe(1);
    expect(decoded.error.message).toBe('Error: Unknown Blockchain type, please use Eth for Etherum or Sol for Solana');
    expect(decoded.error.code).toBe(-32603);

    done();
});