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
  orderId: string;
  amountGet: string;
  amountGive: string;
  price: number;
  timestamp: string;
  formattedTimestamp: string;
}
