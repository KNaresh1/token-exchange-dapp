async function main() {
  const FEE_PERCENT = 10;

  console.log("Preparing deployment...\n");

  // Fetch contracts
  const Token = await ethers.getContractFactory("Token");
  const Exchange = await ethers.getContractFactory("Exchange");

  [deployer, feeAccount, user1, user2] = await ethers.getSigners();

  // Deploy contracts
  const dapp = await Token.deploy("Dapp Token", "DAPP", 1000000);
  await dapp.deployed();
  console.log(`DAPP deployed to: ${dapp.address}\n`);

  const mETH = await Token.deploy("Mock ETH Token", "mETH", 1000000);
  await mETH.deployed();
  console.log(`mETH deployed to: ${mETH.address}\n`);

  const mDAI = await Token.deploy("Mock Dai Token", "mDAI", 1000000);
  await mDAI.deployed();
  console.log(`mDAI deployed to: ${mDAI.address}\n`);

  const exchange = await Exchange.deploy(feeAccount.address, FEE_PERCENT);
  await exchange.deployed();
  console.log(`Exchange deployed to: ${exchange.address}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
