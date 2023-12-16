import { Contract } from "ethers";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { StateCreator, create } from "zustand";
import { IStatus } from "../utils";

interface AccountSlice {
  balance: string;
  tokenBalances: string[];
  exchangeBalances: string[];
  loadBalance: (balance: string) => void;
  loadTokenBalances: (tokenBalances: string[]) => void;
  loadExchangeBalances: (exchangeBalances: string[]) => void;
}

const createAccountSlice: StateCreator<AccountSlice> = (set) => ({
  balance: "0",
  exchangeBalances: [],
  tokenBalances: [],
  loadBalance: (balance) => set(() => ({ balance })),
  loadTokenBalances: (tokenBalances) => set(() => ({ tokenBalances })),
  loadExchangeBalances: (exchangeBalances) => set(() => ({ exchangeBalances })),
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
  depositStatus: IStatus;
  loadExchange: (exchange: Contract) => void;
  setDepositStatus: (depositStatus: IStatus) => void;
}

const createExchangeSlice: StateCreator<ExchangeSlice> = (set) => ({
  exchange: {} as Contract,
  depositStatus: {
    status: "INITIAL",
    transactionHash: undefined,
    event: undefined,
  },
  loadExchange: (exchange) => set(() => ({ exchange })),
  setDepositStatus: (depositStatus) => set(() => ({ depositStatus })),
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
