import { Contract } from "ethers";
import TOKEN_ABI from "../abis/Token.json";
import { IStatus, OrderBookInfo, OrderInfo } from "./types";
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

export const loadOrders = async (
  provider: any,
  exchange: Contract,
  loadOpenOrders: (openOrders: any[]) => void,
  loadFilledOrders: (filledOrders: any[]) => void,
  loadCancelledOrders: (cancelledOrders: any[]) => void
) => {
  const block = await provider.getBlockNumber();

  const cancelledOrders = (
    await exchange.queryFilter("CancelOrder", 0, block)
  ).map((event) => event.args);
  loadCancelledOrders(cancelledOrders);

  const filledOrders = (await exchange.queryFilter("Trade", 0, block)).map(
    (event) => event.args
  );
  loadFilledOrders(filledOrders);

  const allOrders = (await exchange.queryFilter("Order", 0, block)).map(
    (event) => event.args
  );

  const openOrders = allOrders
    ?.filter(
      (ao) =>
        !filledOrders?.some((fo) => fo?.id.toString() === ao?.id.toString())
    )
    ?.filter(
      (o) =>
        !cancelledOrders?.some((co) => co?.id.toString() === o?.id.toString())
    );
  loadOpenOrders(openOrders);
};

export const filterBySelectedTokens = (orders: any[], tokens: Contract[]) => {
  // Filter orders by selected tokens
  return orders
    ?.filter(
      (o) =>
        o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address
    )
    ?.filter(
      (o) =>
        o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address
    );
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
    transactionType: "Transfer",
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
      transactionType: "Transfer",
    });
    console.log("Error while transacting tokens. ", error);
  }
};

export const makeOrder = async (
  provider: any,
  tokens: Contract[],
  exchange: Contract,
  order: OrderInfo,
  orderType: string,
  setTransactionStatus: (transactionStatus: IStatus) => void
) => {
  let transaction;

  // The parms like tokenGet, amountGet, tokenGive & amountGive for Sell order is reverse of Buy order
  const tokenGet = orderType === "Buy" ? tokens[1].address : tokens[0].address;
  const amountGet = parseUnits(
    orderType === "Buy" ? order.amount : order.amount * order.price
  );
  const tokenGive = orderType === "Buy" ? tokens[0].address : tokens[1].address;
  const amountGive = parseUnits(
    orderType === "Buy" ? order.amount * order.price : order.amount
  );

  setTransactionStatus({
    status: "INPROGRESS",
    transactionType: "New Order",
  });
  try {
    const signer = await provider.getSigner();

    transaction = await exchange
      .connect(signer)
      .makeOrder(tokenGet, amountGet, tokenGive, amountGive);
    await transaction.wait();
  } catch (error) {
    setTransactionStatus({
      status: "ERROR",
      transactionType: "New Order",
    });
    console.log("Error while making buy order tokens. ", error);
  }
};

export const cancelOrder = async (
  provider: any,
  exchange: Contract,
  order: OrderBookInfo,
  setTransactionStatus: (transactionStatus: IStatus) => void
) => {
  let transaction;

  setTransactionStatus({
    status: "INPROGRESS",
    transactionType: "Cancel",
  });
  try {
    const signer = await provider.getSigner();

    transaction = await exchange.connect(signer).cancelOrder(order.orderId);
    await transaction.wait();
  } catch (error) {
    setTransactionStatus({
      status: "ERROR",
      transactionType: "Cancel",
    });
    console.log("Error while cancelling the order. ", error);
  }
};

export const fillOrder = async (
  provider: any,
  exchange: Contract,
  order: OrderBookInfo,
  setTransactionStatus: (transactionStatus: IStatus) => void
) => {
  let transaction;

  setTransactionStatus({
    status: "INPROGRESS",
    transactionType: "Fill Order",
  });
  try {
    const signer = await provider.getSigner();

    transaction = await exchange.connect(signer).fillOrder(order.orderId);
    await transaction.wait();
  } catch (error) {
    setTransactionStatus({
      status: "ERROR",
      transactionType: "Fill Order",
    });
    console.log("Error while filling the order. ", error);
  }
};

export const subscribeToEvents = (
  exchange: Contract,
  addOpenOrder: (order: any) => void,
  addFilledOrder: (order: any) => void,
  addCancelledOrder: (order: any) => void,
  addEvent: (event: any) => void,
  transactionStatus: IStatus,
  setTransactionStatus: (transactionStatus: IStatus) => void
) => {
  exchange.on(
    "Order",
    (
      id,
      user,
      tokenGet,
      amountGet,
      tokenGive,
      amountGive,
      timestamp,
      event
    ) => {
      addOpenOrder(event.args);
      addEvent(event);
      setTransactionStatus({
        status: "SUCCESS",
        transactionType: "New Order",
      });
    }
  );

  exchange.on(
    "Trade",
    (
      id,
      user,
      tokenGet,
      amountGet,
      tokenGive,
      amountGive,
      creator,
      timestamp,
      event
    ) => {
      addFilledOrder(event.args);
      addEvent(event);
      setTransactionStatus({
        status: "SUCCESS",
        transactionType: "Fill Order",
      });
    }
  );

  exchange.on(
    "CancelOrder",
    (
      id,
      user,
      tokenGet,
      amountGet,
      tokenGive,
      amountGive,
      timestamp,
      event
    ) => {
      console.log("cancelled order id...", event.args.id.toString());
      addCancelledOrder(event.args);
      addEvent(event);
      setTransactionStatus({
        status: "SUCCESS",
        transactionType: "Cancel",
      });
    }
  );

  exchange.on("Deposit", (token, user, amount, balance, event) => {
    addEvent(event);
    setTransactionStatus({
      status: "SUCCESS",
      transactionType: "Transfer",
    });
  });

  exchange.on("Withdraw", (token, user, amount, balance, event) => {
    addEvent(event);
    setTransactionStatus({
      status: "SUCCESS",
      transactionType: "Transfer",
    });
  });
};
