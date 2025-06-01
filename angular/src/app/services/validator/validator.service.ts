import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  mustBeEmptyOrNotBeBlank(inputValue: string, clonedMessages: Map<string, string>, messageKey: string) {
    if (!inputValue || inputValue.length !== 0 && inputValue.trim().length === 0) {
      clonedMessages.set(messageKey, 'Must be empty or not be blank.')
    } else {
      clonedMessages.delete(messageKey);
    }
  }

  mustNotBeBlank(inputValue: string, clonedMessages: Map<string, string>, messageKey: string) {
    if (!inputValue || inputValue.trim().length === 0) {
      clonedMessages.set(messageKey, 'Must not be blank.')
    } else {
      clonedMessages.delete(messageKey);
    }
  }

  mustBeValidValue(inputValue: string, clonedMessages: Map<string, string>, messageKey: string) {
    if (!inputValue || inputValue.trim().length === 0) {
      clonedMessages.set(messageKey, 'Must be a valid value.')
    } else {
      clonedMessages.delete(messageKey);
    }
  }

  mustBeValidId(inputValue: string, clonedMessages: Map<string, string>, messageKey: string) {
    if (!inputValue || Number.parseInt(inputValue).valueOf() < 0) {
      clonedMessages.set(messageKey, 'Must be a valid value.');
    } else {
      clonedMessages.delete(messageKey);
    }
  }

  mustBeValidOptionalId(inputValue: string, clonedMessages: Map<string, string>, messageKey: string) {
    if (!inputValue || inputValue.length === 0) {
      return;
    } else if (Number.parseInt(inputValue).valueOf() < 0) {
      clonedMessages.set(messageKey, 'Must be a valid value.');
    } else {
      clonedMessages.delete(messageKey);
    }
  }

  mustBePositiveNumber(inputValue: string, clonedMessages: Map<string, string>, messageKey: string) {
    if (!inputValue || Number.parseInt(inputValue).valueOf() < 0) {
      clonedMessages.set(messageKey, 'Must be a positive number.');
    } else {
      clonedMessages.delete(messageKey);
    }
  }

  mustBeValidEmail(inputValue: string, clonedMessages: Map<string, string>, messageKey: string) {
    if (!inputValue || inputValue.trim().length === 0 || // is empty
      !inputValue.includes('@') || // does not contain @
      !inputValue.includes('.') || // does not contain at least a domain separator
      inputValue.split('@').length !== 2 || // contains more than one @
      inputValue.split('@')[0].trim().length === 0 || // email name is empty
      inputValue.split('@')[1].trim().length === 0 || // domain name is empty
      inputValue.split('@')[0].split('.').some(part => part.length === 0) || // email name contains empty parts
      inputValue.split('@')[1].split('.').some(part => part.length === 0) // domain name contains empty parts
    ) {
      clonedMessages.set(messageKey, 'Must be a valid email address.')
    } else {
      clonedMessages.delete(messageKey);
    }
  }

  mustBeValidUsState(inputValue: string, clonedMessages: Map<string, string>, messageKey: string) {
    if (!inputValue || inputValue.trim().length != 2) {
      clonedMessages.set(messageKey, 'Must be a valid US state abbreviation.')
    } else {
      clonedMessages.delete(messageKey);
    }
  }

  mustBeValidZipcode(inputValue: string, clonedMessages: Map<string, string>, messageKey: string) {
    if (!inputValue || (!inputValue.trim().includes('-') && inputValue.trim().length != 5) || (inputValue.trim().includes('-') && inputValue.trim().replace('-', '').length != 9)) {
      clonedMessages.set(messageKey, 'Must be a valid zip code.')
    } else {
      clonedMessages.delete(messageKey);
    }
  }

  mustBeValidPhone(inputValue: string, clonedMessages: Map<string, string>, messageKey: string) {
    if (!inputValue || inputValue.replace(/\D/g, '').length != 10) {
      clonedMessages.set(messageKey, 'Must be a valid 10-digit number.')
    } else {
      clonedMessages.delete(messageKey);
    }
  }

  mustBeBeforeEnd(startDate: string, endDate:string, clonedMessages: Map<string, string>, messageKey: string) {
    if (!startDate || startDate.trim().length === 0 || !endDate || endDate.trim().length === 0) {
      return;
    }
    if (startDate > endDate) {
      clonedMessages.set(messageKey, 'Must be before end date.')
    } else {
      clonedMessages.delete(messageKey);
    }
  }

  mustBeNowOrFuture(date: string, clonedMessages: Map<string, string>, messageKey: string) {
    if (!date || date.trim().length === 0) {
      return;
    }
    const now = new Date();
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
    if (date === nowDate || date > nowDate) {
      clonedMessages.delete(messageKey);
    } else {
      clonedMessages.set(messageKey, 'Must be in the present or the future.')
    }
  }

  mustBePast(date: string, clonedMessages: Map<string, string>, messageKey: string) {
    if (!date || date.trim().length === 0) {
      return;
    }
    const now = new Date();
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
    if (date < nowDate) {
      clonedMessages.delete(messageKey);
    } else {
      clonedMessages.set(messageKey, 'Must be in the past.')
    }
  }

  mustBeValidUrl(url: string, clonedMessages: Map<string, string>, messageKey: string) {
    if (!url || url.trim().length === 0) {
      clonedMessages.set(messageKey, 'Must be a valid URL.')
      return;
    }
    try {
      new URL(url);
      clonedMessages.delete(messageKey);
    } catch {
      clonedMessages.set(messageKey, 'Must be a valid URL.');
    }
  }
}
