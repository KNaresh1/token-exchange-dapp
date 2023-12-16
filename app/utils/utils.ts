import { ethers } from "ethers";

export const formatUnits = (value: string) => {
  return ethers.utils.formatUnits(value, 18);
};

export const parseUnits = (value: number) => {
  return ethers.utils.parseUnits(value.toString(), 18);
};

export const parseEther = (value: string) => {
  return ethers.utils.parseUnits(value, "ether");
};

export const formatEther = (value: string) => {
  return ethers.utils.formatEther(value);
};

export const shortenAccount = (account: string) => {
  return `${account.substring(0, 6)}...${account.substring(
    account.length - 4
  )}`;
};
