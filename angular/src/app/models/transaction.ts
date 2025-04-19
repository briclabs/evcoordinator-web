import { TransactionWithLabels } from "./transaction-with-labels";

export interface Transaction {
  id?: number;
  eventInfoId: number,
  actorId: number,
  recipientId: number,
  amount: number,
  memo?: string,
  transactionType: string,
  instrumentType: string,
  timeRecorded?: string,
}

export function createTransactionFromTransactionWithLabels(transactionWithLabels: TransactionWithLabels): Transaction {
  return {
    id: transactionWithLabels.id,
    eventInfoId: transactionWithLabels.eventInfoId,
    actorId: transactionWithLabels.actorId,
    recipientId: transactionWithLabels.recipientId,
    amount: transactionWithLabels.amount,
    memo: transactionWithLabels.memo,
    transactionType: transactionWithLabels.transactionType,
    instrumentType: transactionWithLabels.instrumentType,
  }
}
