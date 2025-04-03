export interface Payment {
  id?: number;
  eventInfoId: number,
  actorId: number,
  paymentActionType: string,
  recipientId: number,
  amount: number,
  paymentType: string,
  instrumentType: string,
  timeRecorded?: string,
}
