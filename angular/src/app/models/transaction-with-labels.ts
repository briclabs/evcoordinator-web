export interface TransactionWithLabels {
  id?: number;
  eventInfoId: number,
  eventName: string,
  eventTitle: string,
  actorId: number,
  actorNameFirst: string,
  actorNameLast: string,
  recipientId: number,
  recipientNameFirst: string,
  recipientNameLast: string,
  amount: number,
  memo?: string,
  transactionType: string,
  instrumentType: string,
  timeRecorded?: string,
}

export function createDefaultTransactionWithLabels(): TransactionWithLabels {
  return {
    id: 0,
    eventInfoId: 0,
    eventName: '',
    eventTitle: '',
    actorId: 0,
    actorNameFirst: '',
    actorNameLast: '',
    recipientId: 0,
    recipientNameFirst: '',
    recipientNameLast: '',
    amount: 0,
    memo: '',
    transactionType: '',
    instrumentType: '',
  };
}

