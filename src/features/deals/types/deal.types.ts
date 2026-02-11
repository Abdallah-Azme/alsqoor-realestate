// Deal feature types

export interface Deal {
  id: number;
  title: string;
  description?: string;
  price?: number;
  images?: string[];
  [key: string]: any;
}

export interface DealFormData {
  title: string;
  description?: string;
  price?: number;
  images?: File[];
  [key: string]: any;
}
