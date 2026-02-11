export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  image?: string;
  date?: string;
  [key: string]: any;
}
