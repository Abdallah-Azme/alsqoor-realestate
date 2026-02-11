export interface ComplaintType {
  id: number;
  name: string;
  [key: string]: any;
}

export interface Complaint {
  id?: number;
  type_id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  [key: string]: any;
}
