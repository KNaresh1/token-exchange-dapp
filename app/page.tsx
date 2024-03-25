"use client";

import { Box, Divider, Flex, HStack, Stack } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";
import { useEffect } from "react";
import EXCHANGE_ABI from "./abis/Exchange.json";
import { Header, NavBar, ShowAlert } from "./components";
import config from "./config";
import {
  Balance,
  Markets,
  Order,
  OrderBook,
  PriceChart,
  Trades,
  Transactions,
} from "./exchange";
import useContractStore from "./store";
import {
  formatEther,
  loadExchangeTokens,
  loadOrders,
  subscribeToEvents,
} from "./utils";

export default function Home() {
  const { provider, chainId, account } = useWeb3React();

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

  useEffect(() => {
    loadContractData();
  }, [chainId, account]);

  const loadContractData = async () => {
    if (!provider || !chainId || !account) {
      return;
    }
    const currentChainConfig = config.chains[chainId];
    try {
      await loadExchangeTokens(
        provider,
        [currentChainConfig.dappAddress, currentChainConfig.mETHAddress],
        loadTokens,
        loadSymbols
      );
      const exchange = new Contract(
        currentChainConfig.exchangeAddress,
        EXCHANGE_ABI,
        provider
      );
      loadExchange(exchange);

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
    } catch (error) {
      console.error("Error while loading contract data. ", error);
    }
  };

  return (
    <Flex height="100vh">
      <Stack width={380} bg="secondary" p={5}>
        <Header />

        <Markets />

        <Divider mt={3} mb={4} borderColor="gray.600" />

        <Balance />

        <Divider mb={4} borderColor="gray.600" />

        <Order />
      </Stack>
      <Box flex="1" bg="primary" p={5}>
        <NavBar />

        <PriceChart />

        <HStack>
          <Transactions />

          <Trades />
        </HStack>

        <OrderBook />

        <ShowAlert />
      </Box>
    </Flex>
  );
}
