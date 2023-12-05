import { Contract } from "ethers";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

interface TokenStore {
  token: Contract;
  setToken: (token: Contract) => void;
}

const useContractStore = create<TokenStore>((set) => ({
  token: {} as Contract,
  setToken: (token) => set(() => ({ token })),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Contract Store", useContractStore);
}

export default useContractStore;
