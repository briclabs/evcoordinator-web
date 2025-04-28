export interface DonationAddress {
  to: string;
  co: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface FundProcessorInstructions {
  instructions: string[];
  donationAddress: DonationAddress;
}

export interface SiteConfiguration {
  id: number;
  recommendedDonation: number;
  charityName: string;
  charityUrl: string;
  fundProcessorName: string;
  fundProcessorUrl: string;
  fundProcessorInstructions: FundProcessorInstructions;
  eventGuidelines: {
    [key: string]: string[];
  };
}

export function createDefaultSiteConfiguration(): SiteConfiguration {
  return {
    id: 0,
    recommendedDonation: 0,
    charityName: '',
    charityUrl: '',
    fundProcessorName: '',
    fundProcessorUrl: '',
    fundProcessorInstructions: {
      instructions: [
        'bullet1',
        'bullet2',
      ],
      donationAddress: {
        to: '',
        co: '',
        street: '',
        city: '',
        state: '',
        zip: '',
      }
    },
    eventGuidelines: {
      'section one': [
        'bullet1',
        'bullet2',
      ],
      'section two': [
        'bullet1',
        'bullet2',
      ]
    }
  }
}

export function isValidFundProcessorInstructionsObject(value: FundProcessorInstructions): boolean {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!value.instructions.every((item: any) => item && typeof item === 'string')) {
    return false;
  }

  return value.donationAddress.to.trim() !== '' &&
         value.donationAddress.co.trim() !== '' &&
         value.donationAddress.street.trim() !== '' &&
         value.donationAddress.city.trim() !== '' &&
         value.donationAddress.state.trim() !== '' &&
         value.donationAddress.zip.trim() !== '';
}

export function isValidEventGuidelinesObject(value: { [key: string]: string[] }): boolean {
  if (value === null) {
    return false;
  }

  for (const key in value) {
    if (
      !key || key.trim() === '' ||
      value[key].length < 1 ||
      !value[key].every((item: any) => item && typeof item === 'string' && item.trim() !== '')
    ) {
      return false;
    }
  }

  return true;
}
