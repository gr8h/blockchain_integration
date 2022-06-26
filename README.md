# Mad Alien Invasion

The purpose of this to be able to issue transactions on different blockchains.
Currently only ETH blockchain is implemented.

  - [Assumptions](#assumptions)
  - [Enviroment variables](#enviroment-variables)
  - [Running the app](#running-the-app)
  - [Run Tests](#run-tests)
  - [Exposed endpoints](#exposed-endpoints)
  - [Extending functionality](#extending-functionality)

## Assumptions
* Using https://infura.io/ to call the ETH Ropson testnet.

## Enviroment variables
* PORT=`[running port]`
* ETH_API_URL=`[Blockchain public endpoint]`
* ETH_PRIVATE_KEY=`[Account private key to sign the transactions]`
* ETH_ACCOUNT=`[Sender account address]`


## Running the app
```bash
npm run start
```

## Run Tests
```bash
npm run start
npm run test
npm run test:coverage
```

## Exposed endpoints
* `send_transaction` endpoint
  * Input
  ```json
  {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "get_transaction",
      "params": ["0x2baacbc52190c6b52381c663a695d4b1d6afba8ed398406755f6fbd9a49005bd", "ETH"]
  }
  ```
  * Output 
  ```json
  {
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "amount": "0.01",
        "from": "0x50dbFC5D125dF1835BEe19eCEE63E46cdafD715d",
        "hash": "0x2baacbc52190c6b52381c663a695d4b1d6afba8ed398406755f6fbd9a49005bd",
        "to": "0x5A3Da324Bf0470d18C808fcC974a428558A41Ef0",
        "fee": "0.000021000000147"
    }
  }
  ```
* `get_transaction` endpoint
  * Input
  ```json
  {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "send_transaction",
    "params": ["0x5A3Da324Bf0470d18C808fcC974a428558A41Ef0", "0.001", "Eth"]
  }
  ```
  * Output (a message will be logged to the STDOUT whenever a transaction is confirmed)
  ```json
  {
    "jsonrpc": "2.0",
    "id": 1,
    "result": "Transaction sent."
  }
  ```

## Extending functionality
  * Implement ITransaction interface
  * Extend strategies in TransactionStrategyFactory