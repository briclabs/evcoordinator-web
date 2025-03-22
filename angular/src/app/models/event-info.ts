export interface EventInfo {
  id: number;
  eventName: string,
  eventTitle: string,
  dateStart: string,
  dateEnd: string,
  eventStatus: string,
  timeRecorded?: string,
}

export function createDefaultEventInfo(): EventInfo {
  return {
    id: 0,
    eventName: '',
    eventTitle: '',
    dateStart: '',
    dateEnd: '',
    eventStatus: '',
  };
}
