import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";
import { useEffect } from "react";

import EXCHANGE_ABI from "../abis/Exchange.json";
import TOKEN_ABI from "../abis/Token.json";
import config from "../config";
import useContractStore from "../store";
import { formatEther } from "../utils";

const useLoadContract = () => {
  const { provider, account, chainId } = useWeb3React();

  const [loadBalance, loadTokens, loadSymbols, loadExchange] = useContractStore(
    (s) => [s.loadBalance, s.loadTokens, s.loadSymbols, s.loadExchange]
  );

  const currentChainConfig = config.chains[chainId?.toString() || ""];

  const loadContract = async () => {
    try {
      // TOKENS
      const dapp = new Contract(
        currentChainConfig.dappAddress,
        TOKEN_ABI,
        provider
      );
      const mETH = new Contract(
        currentChainConfig.mETHAddress,
        TOKEN_ABI,
        provider
      );
      loadTokens([dapp, mETH]);
      loadSymbols([await dapp.symbol(), await mETH.symbol()]);

      // Exchange
      const exchange = new Contract(
        currentChainConfig.exchangeAddress,
        EXCHANGE_ABI,
        provider
      );
      loadExchange(exchange);

      // Account Balance
      if (provider && account) {
        const acctBalance = await provider.getBalance(account);
        loadBalance(formatEther(acctBalance.toString()));
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
