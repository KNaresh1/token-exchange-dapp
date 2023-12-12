const config = require("../app/config.json");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const wait = (seconds) => {
  const milliseconds = seconds * 1000;
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

async function main() {
  const { chainId } = await ethers.provider.getNetwork();

  const currentChainConfig = config.chains[chainId.toString()];

  const dapp = await ethers.getContractAt(
    "Token",
    currentChainConfig.dappAddress
  );
  console.log(`Dapp Token fetched: ${dapp.address}`);

  const mETH = await ethers.getContractAt(
    "Token",
    currentChainConfig.mETHAddress
  );
  console.log(`mETH Token fetched: ${mETH.address}`);

  const mDAI = await ethers.getContractAt(
    "Token",
    currentChainConfig.mDAIAddress
  );
  console.log(`mDAI Token fetched: ${mDAI.address}\n`);

  const exchange = await ethers.getContractAt(
    "Exchange",
    currentChainConfig.exchangeAddress
  );
  console.log(`Exchange Token fetched: ${exchange.address}\n`);

  const [sender, receiver] = await ethers.getSigners();
  let transaction, result;
  let amount = tokens(10000);

  // Give some initial tokens to sender to fill dapp/mETH orders
  transaction = await mETH.connect(sender).transfer(receiver.address, amount);
  await transaction.wait();
  console.log(
    `Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`
  );

  // Setup users in the exchange
  const [user1, user2] = await ethers.getSigners();

  // Allow users to depoist tokens
  transaction = await dapp.connect(user1).approve(exchange.address, amount);
  result = await transaction.wait();
  console.log(`Approved ${amount} tokens from ${user1.address}`);

  transaction = await exchange
    .connect(user1)
    .depositToken(dapp.address, amount);
  result = await transaction.wait();
  console.log(`Deposited ${amount} tokens from ${user1.address}\n`);

  transaction = await mETH.connect(user2).approve(exchange.address, amount);
  result = await transaction.wait();
  console.log(`Approved ${amount} tokens from ${user2.address}`);

  transaction = await exchange
    .connect(user2)
    .depositToken(mETH.address, amount);
  result = await transaction.wait();
  console.log(`Deposited ${amount} tokens from ${user2.address}\n`);

  // User1 makes order
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, tokens(100), dapp.address, tokens(5));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}`);

  // User1 cancels order
  let orderId = result.events[0].args.id;
  transaction = await exchange.connect(user1).cancelOrder(orderId);
  result = await transaction.wait();
  console.log(`Order Cancelled from ${user1.address}\n`);

  // Wait for 1 second
  await wait(1);

  // 1 - User1 makes order and User2 fills that order
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, tokens(100), dapp.address, tokens(10));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}`);

  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = await transaction.wait();
  console.log(`Filled order from ${user2.address}\n`);

  // Wait for 1 second
  await wait(1);

  // 2 - User1 makes order and User2 fills that order
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, tokens(50), dapp.address, tokens(15));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}`);

  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = await transaction.wait();
  console.log(`Filled order from ${user2.address}\n`);

  // Wait for 1 second
  await wait(1);

  // 3 - User1 makes order and User2 fills that order
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, tokens(200), dapp.address, tokens(20));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}`);

  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = await transaction.wait();
  console.log(`Filled order from ${user2.address}\n`);

  // Wait for 1 second
  await wait(1);

  // Seed Open orders
  for (let i = 1; i <= 10; i++) {
    transaction = await exchange
      .connect(user1)
      .makeOrder(mETH.address, tokens(10 * i), dapp.address, tokens(10));
    result = await transaction.wait();

    console.log(`Made order from ${user1.address}`);
    await wait(1);
  }

  for (let i = 1; i <= 10; i++) {
    transaction = await exchange
      .connect(user2)
      .makeOrder(dapp.address, tokens(10), mETH.address, tokens(10 * i));
    result = await transaction.wait();

    console.log(`Made order from ${user2.address}`);
    await wait(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
