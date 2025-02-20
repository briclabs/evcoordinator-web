export interface ConfigurationResponse {
  id: number; // Unique identifier for this configuration
  recommendedDonation: number; // Recommended donation minimum
  charityName: string; // Name of the charity
  charityUrl: string; // URL of the charity
  fundProcessorName: string; // Name of the fund processor
  fundProcessorUrl: string; // URL of the fund processor
  fundProcessorInstructions: {
    instructions: string[]; // Instructions for fund processing (dynamic keys)
    donationAddress: { // Field for check donation address
      to: string;
      co: string;
      street: string;
      city: string;
      state: string;
      zip: string;
    }
  };
  eventGuidelines: {
    [key: string]: string[] // Guidelines for the event (dynamic keys)
  };
}
