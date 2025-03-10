import { SearchConfiguration } from './search-configuration-request';

export interface SearchRequest {
  searchConfiguration: SearchConfiguration;
  searchCriteria: Record<string, string>;
}
