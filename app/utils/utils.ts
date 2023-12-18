import { ethers } from "ethers";
import moment from "moment";

export const formatUnits = (value: string) => {
  return ethers.utils.formatUnits(value, 18);
};

export const formatUnitsToEther = (value: number) => {
  return ethers.utils.formatUnits(value.toString(), "ether");
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

export const buildOrderInfo = (
  id: number,
  amountGive: number,
  amountGet: number,
  timestamp: string
) => {
  // Calculate token price to 5 decimal places
  const precision = 100000;

  let tokenPrice = amountGet / amountGive;
  tokenPrice = Math.round(tokenPrice * precision) / precision;

  return {
    orderId: id,
    amountGive: formatUnitsToEther(amountGive),
    amountGet: formatUnitsToEther(amountGet),
    price: tokenPrice,
    formattedTimestamp: moment
      .unix(Number(timestamp))
      .format("h:mm:ssa d MMM D"),
  };
};
