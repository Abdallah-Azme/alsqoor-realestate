// Partner/Company feature types

export interface Partner {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  [key: string]: any;
}
