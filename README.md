## Decentralized Token Exchange App
A Decentralized crypto currency exchange, that runs on the blockchain powered by smart contracts and the front end website talks to the smart contracts so that users can trade their crypto currencies in a decentralized way. It is a real world project where we can take real crypto currencies and add them as trading pairs into this exchange and start trading with few minor changes to this application.

### App walkthrough
1. To start with, user can connect to their metamask wallet using the Connect button
2. User can change networks for their trading - (Localhost, Sepolia are currently supported). It can support any other evm compatible chains
3. Can trade tokens by selecting different trading pairs. Currently supported tokens are listed in the dropdown
4. The app basically allows users to deposit and withdraws his funds from/to crypto currency exchange
5. User can buy and sell crypto and he can see all his orders in his list as well as fill the orders
6. In order to trade crypto, user Deposits funds in the crypto currency exchange, he can create a New Order by providing the amount the BuyPrice
7. The newly created order appears in his order list as well as order book wher others can fill the order
8. It also has price chart which shows all the trade history, the price details at given point of time using candle sticks

### Supported Crypto currencies:
DApp/mETH - mock version of eth
DApp/mDAI - mock version of dai

### Supported Networks:
- Localhost - local blockchain run with hardhat
- Sepolia - Testnet

### End-to-End technology stack
1. FrontEnd: 
   1. NextJS     - UI and user interactions
   2. web3-react - interact with smart contract deployed to blockchain
   3. zustand    - state management
   4. ChakraUI   - css styling
2. BackEnd: 
   1. Solidity - Implement smart contracts
   2. Hardhat  - To build, deploy, run and test smart contracts
   3. Ethers   - To interact with Etherum smart contracts


### Testnet
- Node service provider: INFURA
- Website is deployed to IPFS using fleek 


### Steps to run the app
1. $ npm i - To install all the dependencies
2. $ npx hardhat compile - To compile smart contracts
3. $ npx hardhat node - To run local blockchain for development and testing purpose
4. $ npx hardhat run scripts/deploy.js --network localhost - Script that deploys the smart contracts to local blockchain network
5. $ npx hardhat run scripts/seed.js --network localhost - Script that adds initial data rather than doing it manually in order to quickly start using the app 
6. Copy the Exchange and Token abis from compiled smart contracts into fronend app/abi corresponding files
7. $ npm run dev - start the app
8. $ npx hardhat run scripts/deploy.js --network sepolia - Deploy to sepolia testnet