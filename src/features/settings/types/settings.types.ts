// Settings feature types

export interface Settings {
  siteInfo: {
    siteName: string;
    siteLogo: string | null;
    siteFavicon: string | null;
    siteDescription: string;
    currency: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
  };
  contactInfo: {
    siteEmail: string;
    sitePhone: string;
    siteAddress: string;
  };
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
    snapchat: string;
    pinterest: string;
    whatsapp: string;
    telegram: string;
  };
  content: {
    aboutUs: string;
    termsConditions: string;
    privacyPolicy: string;
    contactInfoContent: string;
    ipPolicy: string;
    complaintsPolicy: string;
  };
  certificates: {
    ecommerceCertificate: string | null;
    platformNameCertificate: string | null;
    securityCertificateFile: string | null;
  };
  seo: {
    metaKeywords: string;
    metaDescription: string;
    googleAnalytics: string;
    facebookPixel: string;
  };
}
