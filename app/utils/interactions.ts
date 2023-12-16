import { Contract } from "ethers";
import TOKEN_ABI from "../abis/Token.json";
import { IStatus } from "./types";
import { formatUnits, parseUnits } from "./utils";

export const loadExchangeTokens = async (
  provider: any,
  address: string[],
  loadTokens: (tokens: Contract[]) => void,
  loadSymbols: (sybmols: string[]) => void
) => {
  const token1 = new Contract(address[0], TOKEN_ABI, provider);
  const token2 = new Contract(address[1], TOKEN_ABI, provider);

  loadTokens([token1, token2]);
  loadSymbols([await token1.symbol(), await token2.symbol()]);
};

export const loadUserBalances = async (
  account: string,
  tokens: Contract[],
  exchange: Contract,
  loadTokenBalances: (tokenBalances: string[]) => void,
  loadExchangeBalances: (exchangeBalances: string[]) => void
) => {
  let balance1, balance2;

  // Load user token balances
  balance1 = formatUnits(await tokens[0].balanceOf(account));
  balance2 = formatUnits(await tokens[1].balanceOf(account));
  loadTokenBalances([balance1, balance2]);

  // Load token balances in the exchanges for the given user after he deposits
  balance1 = formatUnits(await exchange.balanceOf(tokens[0].address, account));
  balance2 = formatUnits(await exchange.balanceOf(tokens[1].address, account));
  loadExchangeBalances([balance1, balance2]);
};

export const depositTokens = async (
  provider: any,
  token: Contract,
  exchange: Contract,
  amount: number,
  setDepositStatus: (depositStatus: IStatus) => void
) => {
  let transaction;

  setDepositStatus({
    status: "INPROGRESS",
    transactionHash: undefined,
    event: undefined,
  });
  try {
    const signer = await provider.getSigner();

    const transferAmount = parseUnits(amount);

    transaction = await token
      .connect(signer)
      .approve(exchange.address, transferAmount);
    await transaction.wait();

    transaction = await exchange
      .connect(signer)
      .depositToken(token.address, transferAmount);
    await transaction.wait();
  } catch (error) {
    setDepositStatus({
      status: "ERROR",
      transactionHash: undefined,
      event: undefined,
    });
    console.log("Error while depositing tokens. ", error);
  }
};

export const subscribeToEvents = (
  exchange: Contract,
  setDepositStatus: (depositStatus: IStatus) => void
) => {
  exchange.on("Deposit", ({ event }) => {
    setDepositStatus({
      status: "SUCCESS",
      transactionHash: undefined,
      event: event,
    });
  });
};
