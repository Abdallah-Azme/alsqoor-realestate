export interface AboutData {
  title?: string;
  description?: string;
  content?: string;
  image?: string;
  sections?: Array<{
    title: string;
    content: string;
    image?: string;
  }>;
  [key: string]: any;
}
