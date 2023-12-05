import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";
import { useEffect } from "react";

import TOKEN_ABI from "../abis/Token.json";
import config from "../config";
import useContractStore from "../store";

const useLoadContract = () => {
  const { provider, account, chainId } = useWeb3React();

  const [setToken] = useContractStore((s) => [s.setToken]);

  const currentChainConfig = config.chains[chainId?.toString() || ""];

  const loadContract = async () => {
    try {
      // TOKEN
      const token = new Contract(
        currentChainConfig.tokenAddress,
        TOKEN_ABI,
        provider
      );
      setToken(token);
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
