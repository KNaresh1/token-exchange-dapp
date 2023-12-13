import { Contract } from "ethers";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { StateCreator, create } from "zustand";

interface AccountSlice {
  balance: string;
  loadBalance: (balance: string) => void;
}

const createAccountSlice: StateCreator<AccountSlice> = (set) => ({
  balance: "0",
  loadBalance: (balance) => set(() => ({ balance })),
});

interface TokenSlice {
  tokens: Contract[];
  symbols: string[];
  loadTokens: (tokens: Contract[]) => void;
  loadSymbols: (sybmols: string[]) => void;
}

const createTokenSlice: StateCreator<TokenSlice> = (set) => ({
  tokens: [],
  symbols: [],
  loadTokens: (tokens) => set(() => ({ tokens })),
  loadSymbols: (symbols) => set(() => ({ symbols })),
});

interface ExchangeSlice {
  exchange: Contract;
  loadExchange: (exchange: Contract) => void;
}

const createExchangeSlice: StateCreator<ExchangeSlice> = (set) => ({
  exchange: {} as Contract,
  loadExchange: (exchange) => set(() => ({ exchange })),
});

const useContractStore = create<AccountSlice & TokenSlice & ExchangeSlice>()(
  (...a) => ({
    ...createAccountSlice(...a),
    ...createTokenSlice(...a),
    ...createExchangeSlice(...a),
  })
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Contract Store", useContractStore);
}

export default useContractStore;
