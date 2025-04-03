export interface PaymentWithLabels {
  id?: number;
  eventInfoId: number,
  eventName: string,
  eventTitle: string,
  actorId: number,
  actorNameFirst: string,
  actorNameLast: string,
  paymentActionType: string,
  recipientId: number,
  recipientNameFirst: string,
  recipientNameLast: string,
  amount: number,
  paymentType: string,
  instrumentType: string,
  timeRecorded?: string,
}

export function createDefaultPaymentWithLabels(): PaymentWithLabels {
  return {
    id: 0,
    eventInfoId: 0,
    eventName: '',
    eventTitle: '',
    actorId: 0,
    actorNameFirst: '',
    actorNameLast: '',
    paymentActionType: '',
    recipientId: 0,
    recipientNameFirst: '',
    recipientNameLast: '',
    amount: 0,
    paymentType: '',
    instrumentType: '',
  };
}

