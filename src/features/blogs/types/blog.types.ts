// Blog feature types

export interface Blog {
  id: number;
  title: string;
  description: string;
  image?: string;
  created_at?: string;
  [key: string]: any;
}
