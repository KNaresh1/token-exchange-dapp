import { Contract } from "ethers";
import TOKEN_ABI from "../abis/Token.json";

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
