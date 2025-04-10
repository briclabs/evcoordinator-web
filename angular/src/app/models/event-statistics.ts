import { Invoice } from "./invoice";

export interface EventStatistics {
  eventId: number;
  eventName: string,
  eventTitle: string,
  eventStatus: string,
  dateStart: string,
  dateEnd: string,
  unregisteredGuestCount: number,
  registeredAttendeesCount: number,
  invoices: Invoice[],
  totalInvoiced: number,
  totalExpenses: number,
  totalPledged: number,
  totalIncome: number,
  percentagePledgedReceived: number,
}

export function createDefaultEventStatistics(): EventStatistics {
  return {
    eventId: 0,
    eventName: '',
    eventTitle: '',
    eventStatus: '',
    dateStart: '',
    dateEnd: '',
    unregisteredGuestCount: 0,
    registeredAttendeesCount: 0,
    invoices: [],
    totalInvoiced: 0,
    totalExpenses: 0,
    totalPledged: 0,
    totalIncome: 0,
    percentagePledgedReceived: 0,
  };
}
