import { Contract } from "ethers";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

interface TokenStore {
  dapp: Contract;
  setDapp: (dapp: Contract) => void;
}

const useContractStore = create<TokenStore>((set) => ({
  dapp: {} as Contract,
  setDapp: (dapp) => set(() => ({ dapp })),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Contract Store", useContractStore);
}

export default useContractStore;
