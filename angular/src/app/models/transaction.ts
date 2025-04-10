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
