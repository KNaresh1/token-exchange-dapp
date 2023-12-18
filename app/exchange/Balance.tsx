import {
  Box,
  Button,
  Divider,
  HStack,
  Spacer,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import useContractStore from "../store";
import { loadUserBalances } from "../utils";
import TransactToken from "./TransactToken";

const Balance = () => {
  const { account } = useWeb3React();

  const [activeTab, setActiveTab] = useState<string>("Deposit");

  const [
    symbols,
    tokens,
    exchange,
    tokenBalances,
    exchangeBalances,
    transactionStatus,
    loadTokenBalances,
    loadExchangeBalances,
  ] = useContractStore((s) => [
    s.symbols,
    s.tokens,
    s.exchange,
    s.tokenBalances,
    s.exchangeBalances,
    s.transactionStatus,
    s.loadTokenBalances,
    s.loadExchangeBalances,
  ]);

  useEffect(() => {
    if (account && tokens.length > 0 && Object.keys(exchange).length !== 0) {
      loadUserBalances(
        account,
        tokens,
        exchange,
        loadTokenBalances,
        loadExchangeBalances
      );
    }
  }, [account, tokens, exchange, transactionStatus]);

  return (
    <Box>
      <HStack>
        <Text fontSize="sm" fontWeight="semibold">
          Balance
        </Text>
        <Spacer />
        <Box bg="primary" rounded={6}>
          <Button
            p={3}
            size="xs"
            colorScheme={activeTab === "Deposit" ? "blue" : ""}
            onClick={() => setActiveTab("Deposit")}
          >
            Deposit
          </Button>
          <Button
            p={3}
            size="xs"
            colorScheme={activeTab === "Withdraw" ? "blue" : ""}
            onClick={() => setActiveTab("Withdraw")}
          >
            Withdraw
          </Button>
        </Box>
      </HStack>
      <Tabs>
        <TabPanels>
          <TabPanel pl={0}>
            <Box>
              <TransactToken
                token={tokens[0]}
                symbol={symbols[0]}
                transactionType={activeTab}
                tokenBalance={tokenBalances[0]}
                exchangeBalance={exchangeBalances[0]}
              />

              <Divider mt={5} mb={6} borderColor="gray.600" />

              <TransactToken
                token={tokens[1]}
                symbol={symbols[1]}
                transactionType={activeTab}
                tokenBalance={tokenBalances[1]}
                exchangeBalance={exchangeBalances[1]}
              />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Balance;
