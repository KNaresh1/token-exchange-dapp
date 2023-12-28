import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";
import { useEffect } from "react";

import EXCHANGE_ABI from "../abis/Exchange.json";
import config from "../config";
import useContractStore from "../store";
import {
  formatEther,
  loadExchangeTokens,
  loadOrders,
  subscribeToEvents,
} from "../utils";

const useLoadContract = () => {
  const { provider, account, chainId } = useWeb3React();

  const [
    loadBalance,
    loadTokens,
    loadSymbols,
    loadExchange,
    addOpenOrder,
    addFilledOrder,
    addCancelledOrder,
    loadOpenOrders,
    loadFilledOrders,
    loadCancelledOrders,
    addEvent,
    transactionStatus,
    setTransactionStatus,
  ] = useContractStore((s) => [
    s.loadBalance,
    s.loadTokens,
    s.loadSymbols,
    s.loadExchange,
    s.addOpenOrder,
    s.addFilledOrder,
    s.addCancelledOrder,
    s.loadOpenOrders,
    s.loadFilledOrders,
    s.loadCancelledOrders,
    s.addEvent,
    s.transactionStatus,
    s.setTransactionStatus,
  ]);

  const currentChainConfig = config.chains[chainId?.toString() || ""];

  const loadContract = async () => {
    try {
      await loadExchangeTokens(
        provider,
        [currentChainConfig.dappAddress, currentChainConfig.mETHAddress],
        loadTokens,
        loadSymbols
      );

      // Exchange
      const exchange = new Contract(
        currentChainConfig.exchangeAddress,
        EXCHANGE_ABI,
        provider
      );
      loadExchange(exchange);

      // Account Balance
      if (provider && account && exchange) {
        const acctBalance = await provider.getBalance(account);
        loadBalance(formatEther(acctBalance.toString()));
        loadOrders(
          provider,
          exchange,
          loadOpenOrders,
          loadFilledOrders,
          loadCancelledOrders
        );

        subscribeToEvents(
          exchange,
          addOpenOrder,
          addFilledOrder,
          addCancelledOrder,
          addEvent,
          transactionStatus,
          setTransactionStatus
        );
      }
    } catch (error) {
      console.error("Error while loading contract. ", error);
    }
  };

  useEffect(() => {
    if (chainId && account && provider) {
      loadContract();
    }
  }, [chainId, account, provider]);
};

export default useLoadContract;
