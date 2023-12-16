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

export const transactTokens = async (
  provider: any,
  token: Contract,
  exchange: Contract,
  amount: number,
  transactionType: string,
  setTransactionStatus: (transactionStatus: IStatus) => void
) => {
  let transaction;

  setTransactionStatus({
    status: "INPROGRESS",
    event: undefined,
  });
  try {
    const signer = await provider.getSigner();

    const transferAmount = parseUnits(amount);

    if (transactionType === "Deposit") {
      transaction = await token
        .connect(signer)
        .approve(exchange.address, transferAmount);
      await transaction.wait();

      transaction = await exchange
        .connect(signer)
        .depositToken(token.address, transferAmount);
    } else {
      transaction = await exchange
        .connect(signer)
        .withdrawToken(token.address, transferAmount);
    }
    await transaction.wait();
  } catch (error) {
    setTransactionStatus({
      status: "ERROR",
      event: undefined,
    });
    console.log("Error while depositing tokens. ", error);
  }
};

export const subscribeToEvents = (
  exchange: Contract,
  setTransactionStatus: (transactionStatus: IStatus) => void
) => {
  exchange.on("Deposit", ({ event }) => {
    setTransactionStatus({
      status: "SUCCESS",
      event: event,
    });
  });

  exchange.on("Withdraw", ({ event }) => {
    setTransactionStatus({
      status: "SUCCESS",
      event: event,
    });
  });
};
