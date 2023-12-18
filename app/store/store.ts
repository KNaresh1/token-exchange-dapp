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
  allOrders: any[];
  openOrders: any[];
  filledOrders: any[];
  cancelledOrders: any[];
  events: any[];
  transactionStatus: IStatus;
  addOrder: (order: any) => void;
  loadAllOrders: (allOrders: any[]) => void;
  loadOpenOrders: (openOrders: any[]) => void;
  loadFilledOrders: (filledOrders: any[]) => void;
  loadCancelledOrders: (cancelledOrders: any[]) => void;
  addEvent: (event: any) => void;
  loadExchange: (exchange: Contract) => void;
  setTransactionStatus: (transactionStatus: IStatus) => void;
}

const createExchangeSlice: StateCreator<ExchangeSlice> = (set) => ({
  exchange: {} as Contract,
  allOrders: [],
  openOrders: [],
  filledOrders: [],
  cancelledOrders: [],
  events: [],
  transactionStatus: {
    status: "INITIAL",
    transactionType: "",
  },
  addOrder: (order) =>
    set((store) => ({ allOrders: [...store.allOrders, order] })),
  loadAllOrders: (allOrders) => set(() => ({ allOrders })),
  loadOpenOrders: (openOrders) => set(() => ({ openOrders })),
  loadFilledOrders: (filledOrders) => set(() => ({ filledOrders })),
  loadCancelledOrders: (cancelledOrders) => set(() => ({ cancelledOrders })),
  addEvent: (event) => set((store) => ({ events: [...store.events, event] })),
  loadExchange: (exchange) => set(() => ({ exchange })),
  setTransactionStatus: (transactionStatus) =>
    set(() => ({ transactionStatus })),
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
