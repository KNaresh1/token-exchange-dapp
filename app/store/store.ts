import { Contract } from "ethers";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { StateCreator, create } from "zustand";
import { IStatus } from "../utils";

type AccountSlice = {
  balance: string;
  tokenBalances: string[];
  exchangeBalances: string[];
};

type AccountActions = {
  loadBalance: (balance: string) => void;
  loadTokenBalances: (tokenBalances: string[]) => void;
  loadExchangeBalances: (exchangeBalances: string[]) => void;
};

type TokenSlice = {
  tokens: Contract[];
  symbols: string[];
};

type TokenActions = {
  loadTokens: (tokens: Contract[]) => void;
  loadSymbols: (sybmols: string[]) => void;
};

type ExchangeSlice = {
  exchange: Contract;
  openOrders: any[];
  filledOrders: any[];
  cancelledOrders: any[];
  events: any[];
  transactionStatus: IStatus;
};

type ExchangeActions = {
  addOpenOrder: (order: any) => void;
  addFilledOrder: (order: any) => void;
  addCancelledOrder: (order: any) => void;
  loadOpenOrders: (openOrders: any[]) => void;
  loadFilledOrders: (filledOrders: any[]) => void;
  loadCancelledOrders: (cancelledOrders: any[]) => void;
  addEvent: (event: any) => void;
  loadExchange: (exchange: Contract) => void;
  setTransactionStatus: (transactionStatus: IStatus) => void;
};

const accountInitialState: AccountSlice = {
  balance: "0",
  exchangeBalances: [],
  tokenBalances: [],
};

const tokenInitialState: TokenSlice = {
  tokens: [],
  symbols: [],
};

const exchangeInitialState: ExchangeSlice = {
  exchange: {} as Contract,
  openOrders: [],
  filledOrders: [],
  cancelledOrders: [],
  events: [],
  transactionStatus: {
    status: "INITIAL",
    transactionType: "",
  },
};

const sliceResetFns = new Set<() => void>();

export const resetStore = () => {
  sliceResetFns.forEach((resetFn) => {
    resetFn();
  });
};

const createAccountSlice: StateCreator<AccountSlice & AccountActions> = (
  set
) => {
  sliceResetFns.add(() => set(accountInitialState));
  return {
    ...accountInitialState,
    loadBalance: (balance) => set(() => ({ balance })),
    loadTokenBalances: (tokenBalances) => set(() => ({ tokenBalances })),
    loadExchangeBalances: (exchangeBalances) =>
      set(() => ({ exchangeBalances })),
  };
};

const createTokenSlice: StateCreator<TokenSlice & TokenActions> = (set) => {
  sliceResetFns.add(() => set(tokenInitialState));
  return {
    ...tokenInitialState,
    loadTokens: (tokens) => set(() => ({ tokens })),
    loadSymbols: (symbols) => set(() => ({ symbols })),
  };
};

const createExchangeSlice: StateCreator<ExchangeSlice & ExchangeActions> = (
  set
) => {
  sliceResetFns.add(() => set(exchangeInitialState));
  return {
    ...exchangeInitialState,
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
  };
};

const useContractStore = create<
  AccountSlice &
    AccountActions &
    TokenSlice &
    TokenActions &
    ExchangeSlice &
    ExchangeActions
>()((...a) => ({
  ...createAccountSlice(...a),
  ...createTokenSlice(...a),
  ...createExchangeSlice(...a),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Contract Store", useContractStore);
}

export default useContractStore;
