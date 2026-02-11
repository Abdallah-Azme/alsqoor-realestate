// Settings feature types

export interface Settings {
  contactInfo?: {
    sitePhone?: string;
    email?: string;
    address?: string;
  };
  [key: string]: any;
}
