export interface ServiceDescriptionsData {
  offers: string;
  requests: string;
  deals: string;
  ads: string;
  marketplace: string;
}

export type ServiceType = keyof ServiceDescriptionsData;
