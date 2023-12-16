import { Box, Divider } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import useContractStore from "../store";
import { loadUserBalances } from "../utils";
import DepositToken from "./DepositToken";

const Deposit = () => {
  const { account } = useWeb3React();

  const [
    symbols,
    tokens,
    exchange,
    tokenBalances,
    exchangeBalances,
    depositStatus,
    loadTokenBalances,
    loadExchangeBalances,
  ] = useContractStore((s) => [
    s.symbols,
    s.tokens,
    s.exchange,
    s.tokenBalances,
    s.exchangeBalances,
    s.depositStatus,
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
  }, [account, tokens, exchange, depositStatus]);

  return (
    <Box>
      <DepositToken
        token={tokens[0]}
        symbol={symbols[0]}
        tokenBalance={tokenBalances[0]}
        exchangeBalance={exchangeBalances[0]}
      />

      <Divider mt={5} mb={6} borderColor="gray.600" />

      <DepositToken
        token={tokens[1]}
        symbol={symbols[1]}
        tokenBalance={tokenBalances[1]}
        exchangeBalance={exchangeBalances[1]}
      />
    </Box>
  );
};

export default Deposit;
