export type STATUS_TYPE = "INITIAL" | "INPROGRESS" | "SUCCESS" | "ERROR";

export interface IStatus {
  status: STATUS_TYPE;
  transactionType: string;
}

export interface OrderInfo {
  amount: number;
  price: number;
}

export interface OrderBookInfo {
  orderId: number;
  tokenGet: string;
  amountGet: string;
  tokenGive: string;
  amountGive: string;
  price: number;
  creator: null | string;
  timestamp: string;
  formattedTimestamp: string;
}
