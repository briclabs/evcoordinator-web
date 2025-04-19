export interface SiteConfiguration {
  id: number;
  recommendedDonation: number;
  charityName: string;
  charityUrl: string;
  fundProcessorName: string;
  fundProcessorUrl: string;
  fundProcessorInstructions: {
    instructions: string[];
    donationAddress: {
      to: string;
      co: string;
      street: string;
      city: string;
      state: string;
      zip: string;
    }
  };
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
      instructions: [],
      donationAddress: {
        to: '',
        co: '',
        street: '',
        city: '',
        state: '',
        zip: '',
      }
    },
    eventGuidelines: {}
  }
}
