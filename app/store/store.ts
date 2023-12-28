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
  openOrders: any[];
  filledOrders: any[];
  cancelledOrders: any[];
  events: any[];
  transactionStatus: IStatus;
  addOpenOrder: (order: any) => void;
  addFilledOrder: (order: any) => void;
  addCancelledOrder: (order: any) => void;
  loadOpenOrders: (openOrders: any[]) => void;
  loadFilledOrders: (filledOrders: any[]) => void;
  loadCancelledOrders: (cancelledOrders: any[]) => void;
  addEvent: (event: any) => void;
  loadExchange: (exchange: Contract) => void;
  setTransactionStatus: (transactionStatus: IStatus) => void;
}

const createExchangeSlice: StateCreator<ExchangeSlice> = (set) => ({
  exchange: {} as Contract,
  openOrders: [],
  filledOrders: [],
  cancelledOrders: [],
  events: [],
  transactionStatus: {
    status: "INITIAL",
    transactionType: "",
  },
  addOpenOrder: (order) =>
    set((store) => ({
      openOrders: [...store.openOrders, order],
    })),
  addFilledOrder: (order) =>
    set((store) => ({
      filledOrders: [...store.filledOrders, order],
      openOrders: store.openOrders?.filter(
        (o) => o.id.toString() !== order.id.toString()
      ),
    })),
  addCancelledOrder: (order) =>
    set((store) => ({
      cancelledOrders: [...store.cancelledOrders, order],
      openOrders: store.openOrders?.filter(
        (o) => o.id.toString() !== order.id.toString()
      ),
    })),
  loadOpenOrders: (openOrders) => set(() => ({ openOrders })),
  loadFilledOrders: (filledOrders) => set(() => ({ filledOrders })),
  loadCancelledOrders: (cancelledOrders) => set(() => ({ cancelledOrders })),
  addEvent: (event) => set((store) => ({ events: [event, ...store.events] })),
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
